import fetchers from "../../src/fetchers/index";

jest.mock("yahoo-finance2", () => ({
  quoteSummary: (symbol: string) => {
    const exampleResponse =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("../../src/fetchers/yf-unofficial/example-response.json") as Record<
        string,
        unknown
      >;
    return Promise.resolve(exampleResponse[symbol]);
  },
}));

describe("yf-unofficial fetcher", () => {
  const sut = fetchers["yf-unofficial"]!;

  it("should properly fetch data", async () => {
    const result = await sut.fetchAll([
      "TSLA",
      "AMZN",
      "GOOG",
      "IBM",
      "AAPL",
      "CHF",
      "MXN",
      "BRL",
      "COP",
      "ARS",
      "PEN",
    ]);

    expect(result).toEqual([
      {
        symbol: "TSLA",
        value: 986.95,
      },
      {
        symbol: "AMZN",
        value: 3015.75,
      },
      {
        symbol: "GOOG",
        value: 2567.49,
      },
      {
        symbol: "IBM",
        value: 125.98,
      },
      {
        symbol: "AAPL",
        value: 167.66,
      },
      {
        symbol: "CHF",
        value: 1.0700796,
      },
      {
        symbol: "MXN",
        value: 0.05058169,
      },
      {
        symbol: "BRL",
        value: 0.2149382,
      },
      {
        symbol: "COP",
        value: 0.0002667983,
      },
      {
        symbol: "ARS",
        value: 0.008877053,
      },
      {
        symbol: "PEN",
        value: 0.26877385,
      },
    ]);
  });
});
