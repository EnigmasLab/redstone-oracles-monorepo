require("dotenv").config();

function getFromEnv(envName: string) {
  const valueFromEnv = process.env[envName];
  if (!valueFromEnv) {
    throw new Error(`Env ${envName} must be specified`);
  }
  return valueFromEnv;
}

export const mongoDbUrl = getFromEnv("MONGO_DB_URL");
export const metricsUrl = getFromEnv("METRICS_URL");
export const dbTtlInDays = Number(getFromEnv("DB_DATA_TTL_DAYS"));
export const uptimeKumaUrl = getFromEnv("UPTIME_KUMA_URL");
export const dataFeedsToCheck = [
  {
    id: "redstone",
    checkWithoutSymbol: true,
    symbolsToCheck: ["ETH", "STX"],
    checkEachSingleSource: false,
    minTimestampDiffForWarning: 120000,
    schedule: "0 * * * *", // Every hour at 0th minute, e.g. 15:00, 16:00, 17:00, ...
  },
  {
    id: "redstone-stocks",
    checkWithoutSymbol: true,
    symbolsToCheck: ["AAPL"],
    checkEachSingleSource: true,
    minTimestampDiffForWarning: 120000,
    schedule: "5 * * * *", // Every hour at 5th minute, e.g. 15:05, 16:05
  },
  {
    id: "redstone-rapid",
    checkWithoutSymbol: true,
    symbolsToCheck: ["ETH"],
    checkEachSingleSource: true,
    minTimestampDiffForWarning: 20000,
    schedule: "*/10 * * * *", // Every 10 minutes
  },
  {
    id: "redstone-avalanche",
    checkWithoutSymbol: true,
    checkEachSingleSource: true,
    symbolsToCheck: ["AVAX"],
    minTimestampDiffForWarning: 20000,
    schedule: "15 * * * *", // Every hour at 15th minute
  },
  {
    id: "redstone-custom-urls-demo",
    checkWithoutSymbol: true,
    symbolsToCheck: [],
    checkEachSingleSource: true,
    minTimestampDiffForWarning: 120000,
    schedule: "20 * * * *", // Every hour at 20th minute
  },
  {
    id: "redstone-avalanche-prod",
    checkWithoutSymbol: true,
    symbolsToCheck: ["AVAX", "QI", "YAK"],
    checkEachSingleSource: true,
    minTimestampDiffForWarning: 20000,
    schedule: "*/10 * * * * *", // Every 10 seconds
  },
];