const generateSubManifest = require("./generate-submanifest-from-main");

const OUTPUT_FILE_PATH = "./manifests/data-services/rapid.json";
const SYMBOLS = [
  "BTC",
  "ETH",
  "USDT",
  "BNB",
  "DOGE",
  "XRP",
  "ADA",
  "DOT",
  "XLM",
  "AR",
  "CELO",
  "AVAX",
  "USDC",
  "FRAX",
  "VST",
];

generateSubManifest(SYMBOLS, OUTPUT_FILE_PATH);
