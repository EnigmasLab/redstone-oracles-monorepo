import { ethereumProvider } from "../../utils/blockchain-providers";

export default {
  // this contract is stateless
  poolInformationAddress: "0xadc6ced7666779ede88e82c95e363450ac59bfd3",
  provider: ethereumProvider,
  tokens: {
    SWETH: {
      token0Symbol: "SWETH",
      token1Symbol: "WETH",
      token0Decimals: 18,
      token1Decimals: 18,
      pairedToken: "ETH",
      poolAddress: "0x0CE176E1b11A8f88a4Ba2535De80E81F88592bad",
    },
    LUSD: {
      token0Symbol: "LUSD",
      token1Symbol: "USDC",
      token0Decimals: 18,
      token1Decimals: 6,
      pairedToken: "USDC",
      poolAddress: "0x6c6FC818b25dF89A8adA8da5A43669023bAD1F4c",
    },
    wstETH: {
      token0Symbol: "WETH",
      token1Symbol: "wstETH",
      token0Decimals: 18,
      token1Decimals: 18,
      pairedToken: "ETH",
      poolAddress: "0x0eB1C92f9f5EC9D817968AfDdB4B46c564cdeDBe",
    },
    USDC: {
      token0Symbol: "USDC",
      token1Symbol: "USDT",
      token0Decimals: 6,
      token1Decimals: 6,
      pairedToken: "USDT",
      poolAddress: "0xD0b2F5018B5D22759724af6d4281AC0B13266360",
    },
  },
};
