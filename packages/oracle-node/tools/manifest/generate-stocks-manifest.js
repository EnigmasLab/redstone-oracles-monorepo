const generateSubManifest = require("./generate-submanifest-from-main");

const OUTPUT_FILE_PATH = "./manifests/data-services/stocks.json";
const SYMBOLS = [
  // Crypto
  "BTC",
  "ETH",
  "CELO",

  // Stocks
  "TSLA",
  "AAPL",
  "IBM",
  "AMZN",
  "GOOG",
  "COST",
  "DIS",
  "MA",
  "MSFT",
  "NFLX",
  "NKE",
  "PINS",
  "SHOP",
  "SPOT",
  "TDOC",

  // ETFs
  "SPY",
  "QQQ",
  "ONEQ",
  "IWM",
  "EFA",
  "VGK",
  "INDA",
  "RSX",

  // Grains
  "ZC=F",
  "ZS=F",
  "ZM=F",
  "ZW=F",
  "KE=F",
  "ZO=F",
  "ZR=F",

  // Energies
  "CL=F",
  "RB=F",
  "NG=F",
  "QA=F",
  "EH=F",

  // Metals
  "GC=F",
  "SI=F",
  "HG=F",
  "PL=F",
  "PA=F",

  // Livestocks
  "LE=F",
  "GF=F",
  "HE=F",
  "PRK=F",
  "DC=F",
  "GNF=F",
  "CB=F",
  "CSC=F",

  // Popular currencies
  "GBP",
  "AUD",
  "CHF",
  "EUR",
  "JPY",

  // Latin american currencies
  "MXN",
  "ARS",
  "PEN",
  "BRLUSD=X",
  "COPUSD=X",

  // More stocks (requested by Moola)
  "BBBY",
  "UPST",
  "BIG",
  "MSTR",
  "BYND",
  "HRTX",
  "EVGO",
  "BGFV",
  "FUBO",
  "CVNA",
  "NKLA",
  "W",
  "BLNK",
  "SRG",
  "HYZN",
  "MVIS",
  "PETS",
  "IBRX",
  "VUZI",
  "SPCE",
  "RIDE",
  "FUV",
  "WKHS",
  "SWTX",
  "ICPT",
  "LCID",
  "JWN",
  "FFIE",
  "SFT",
  "OCGN",
  "REI",
  "BKKT",
  "KPTI",
  "SDC",
  "DNMR",
  "GDRX",
  "IGMS",
  "GME",
  "AMC",
  "APE",
  "META",
];

generateSubManifest(SYMBOLS, OUTPUT_FILE_PATH, {
  interval: 60000,
  sourceTimeout: 30000,
});
