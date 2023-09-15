import { ErrorCode } from "@ethersproject/logger";
import { TransactionResponse } from "@ethersproject/providers";
import { BigNumber, Contract, providers } from "ethers";
import { fetchWithCache, sleepMS } from "./common";
import {
  AuctionModelFee,
  AuctionModelGasEstimator,
} from "./AuctionModelGasEstimator";
import { Eip1559Fee, Eip1559GasEstimator } from "./Eip1559GasEstimator";
import { GasEstimator } from "./GasEstimator";

const ONE_GWEI = 1e9;

export type FeeStructure = Eip1559Fee | AuctionModelFee;

type EthersError = {
  code?: string | number;
  message: string;
};

type ContractOverrides = {
  nonce: number;
} & FeeStructure;

type LastDeliveryAttempt = {
  nonce: number;
  result?: TransactionResponse;
};

type GasOracleFn = (opts: TransactionDeliveryManOpts) => Promise<FeeStructure>;

export type TransactionDeliveryManOpts = {
  /**
   * It depends on network block finalization
   * For example for ETH ~12 s block times  we should set it to 14_000
   */
  expectedDeliveryTimeMs: number;

  /**
   * Gas limit used by contract
   */
  gasLimit: number;

  /**
   * If network support arbitrum like 2D fees should be set to true
   * more info: https://medium.com/offchainlabs/understanding-arbitrum-2-dimensional-fees-fd1d582596c9
   */
  twoDimensionFees?: boolean;

  /**
   * Max number of attempts to deliver transaction
   */
  maxAttempts?: number;

  /**
   * Multiply last failed gas fee by
   */
  multiplier?: number;

  /**
   * Multiply las failed gas limit by
   */
  gasLimitMultiplier?: number;

  /**
   * If we want to take rewards from last block we can achieve is using percentiles
   * 75 percentile we will receive reward which was given by 75% of users and 25% of them has given bigger reward
   * the bigger the value the higher priority fee
   * If you want to prioritize speed over cost choose number between 75-95
   * If you want to prioritize cost over speed choose numbers between 1-50
   */
  percentileOfPriorityFee?: number;

  /**
   * Should be set to true if chain doesn't support EIP1559
   */
  isAuctionModel?: boolean;

  logger?: (text: string) => void;
};

export const unsafeBnToNumber = (bn: BigNumber) => Number(bn.toString());

const getEthFeeFromGasOracle: GasOracleFn = async (
  opts: TransactionDeliveryManOpts
) => {
  const response = // rate limit is 5 seconds
    (
      await fetchWithCache<{
        result: { suggestBaseFee: number; FastGasPrice: number };
      }>(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle`,
        6_000
      )
    ).data;

  const { suggestBaseFee, FastGasPrice } = response.result;

  if (!suggestBaseFee || !FastGasPrice) {
    throw new Error("Failed to fetch price from oracle");
  }

  return {
    maxFeePerGas: Math.round(FastGasPrice * ONE_GWEI),
    maxPriorityFeePerGas: Math.round(
      (FastGasPrice - suggestBaseFee) * ONE_GWEI
    ),
    gasLimit: opts.gasLimit,
  };
};

const CHAIN_ID_TO_GAS_ORACLE = {
  1: getEthFeeFromGasOracle,
} as Record<number, GasOracleFn | undefined>;

const DEFAULT_TRANSACTION_DELIVERY_MAN_PTS = {
  isAuctionModel: false,
  maxAttempts: 10,
  multiplier: 1.125, // 112,5%
  gasLimitMultiplier: 1.5,
  percentileOfPriorityFee: 75,
  twoDimensionFees: false,
  logger: (text: string) =>
    console.log(`[${TransactionDeliveryMan.name}] ${text}`),
};

export class TransactionDeliveryMan {
  private readonly opts: Required<TransactionDeliveryManOpts>;
  private readonly estimator: GasEstimator<FeeStructure>;

  constructor(opts: TransactionDeliveryManOpts) {
    this.opts = { ...DEFAULT_TRANSACTION_DELIVERY_MAN_PTS, ...opts };
    this.estimator = this.opts.isAuctionModel
      ? new AuctionModelGasEstimator(this.opts)
      : new Eip1559GasEstimator(this.opts);
  }

  public async deliver<T extends Contract, M extends keyof T>(
    contract: T,
    method: M,
    params: Parameters<T[M]>
  ): Promise<TransactionResponse> {
    const provider = contract.provider as providers.JsonRpcProvider;
    const address = await contract.signer.getAddress();

    let lastAttempt: LastDeliveryAttempt | undefined = undefined;

    const currentNonce = await provider.getTransactionCount(address);
    const fees = await this.getFees(provider);
    const contractOverrides: ContractOverrides = {
      nonce: currentNonce,
      ...fees,
    };

    for (let i = 0; i < this.opts.maxAttempts; i++) {
      try {
        lastAttempt = { ...contractOverrides };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        lastAttempt.result = await contract[method](...params, {
          ...contractOverrides,
        });
      } catch (err) {
        const e = err as EthersError;
        // if underpriced then bump fee
        this.opts.logger(
          `Failed attempt to call contract code ${e.code} message: ${e.message}`
        );

        if (TransactionDeliveryMan.isUnderpricedError(e)) {
          const scaledFees = this.estimator.scaleFees(
            await this.getFees(provider)
          );
          Object.assign(contractOverrides, scaledFees);
          // we don't want to sleep on error, we want to react fast
          continue;
        } else {
          throw e;
        }
      }

      await sleepMS(this.opts.expectedDeliveryTimeMs);

      const currentNonce = await provider.getTransactionCount(address);
      if (this.isTransactionDelivered(lastAttempt, currentNonce)) {
        // transaction was already delivered because nonce increased
        if (!lastAttempt.result) {
          throw new Error(
            "Transaction with sane nonce was delivered by someone else"
          );
        }
        return lastAttempt.result;
      } else {
        const scaledFees = this.estimator.scaleFees(contractOverrides);
        Object.assign(contractOverrides, scaledFees);
      }
    }

    throw new Error(
      `Failed to deliver transaction after ${this.opts.maxAttempts} attempts`
    );
  }

  private static isUnderpricedError(e: EthersError) {
    return (
      // RPC errors sucks most of the time, thus we can not rely on them
      e.message.includes("maxFeePerGas") ||
      e.message.includes("baseFeePerGas") ||
      e.code === ErrorCode.INSUFFICIENT_FUNDS ||
      e.code === ErrorCode.SERVER_ERROR ||
      e.code === ErrorCode.UNPREDICTABLE_GAS_LIMIT ||
      e.code === ErrorCode.INSUFFICIENT_FUNDS
    );
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  private isTransactionDelivered(
    lastAttempt: LastDeliveryAttempt | undefined,
    currentNonce: number
  ) {
    return lastAttempt && currentNonce > lastAttempt.nonce;
  }

  private async getFees(
    provider: providers.JsonRpcProvider
  ): Promise<FeeStructure> {
    try {
      return await this.getFeeFromGasOracle(provider);
    } catch (e) {
      return await this.estimator.getFees(provider);
    }
  }

  private async getFeeFromGasOracle(
    provider: providers.JsonRpcProvider
  ): Promise<FeeStructure> {
    const { chainId } = await provider.getNetwork();
    const gasOracle = CHAIN_ID_TO_GAS_ORACLE[chainId];
    if (!gasOracle) {
      throw new Error(`Gas oracle is not defined for ${chainId}`);
    }

    const fee = await gasOracle(this.opts);

    this.opts.logger(`getFees result from gasOracle ${JSON.stringify(fee)}`);

    return fee;
  }
}
