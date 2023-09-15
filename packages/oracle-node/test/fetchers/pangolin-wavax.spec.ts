import fetchers from "../../src/fetchers/index";
import {
  mockFetcherResponse,
  mockFetcherResponseWithFunction,
} from "./_helpers";

const pathToExampleResponse =
  "../../src/fetchers/pangolin/example-response.json";
const expectedResult = [
  {
    symbol: "PNG",
    value: 1.932385477521399,
  },
  {
    symbol: "QI",
    value: 1.1545442496079128,
  },
  {
    symbol: "SPORE",
    value: 1.5535988940290127e-10,
  },
  {
    symbol: "XAVA",
    value: 3.0086266440424607,
  },
  {
    symbol: "YAK",
    value: 2.531574131043456,
  },
  {
    symbol: "PTP",
    value: 1.454891278286737,
  },
];

jest.mock("axios");

describe("pangolin-wavax fetcher", () => {
  const sut = fetchers["pangolin-wavax"]!;

  it("should properly fetch data", async () => {
    // Given
    mockFetcherResponse(pathToExampleResponse);

    // When
    const result = await sut.fetchAll([
      "PNG",
      "QI",
      "SPORE",
      "XAVA",
      "YAK",
      "PTP",
    ]);

    // Then
    expect(result).toEqual(expectedResult);
  });

  it("should retry data fetching", async () => {
    // Given
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const exampleResponse = require(pathToExampleResponse) as unknown;
    let tryCounter = 0;
    const getResponse = () => {
      tryCounter++;
      if (tryCounter > 1) {
        return exampleResponse;
      } else {
        return undefined;
      }
    };
    mockFetcherResponseWithFunction(getResponse);

    // When
    const result = await sut.fetchAll([
      "PNG",
      "QI",
      "SPORE",
      "XAVA",
      "YAK",
      "PTP",
    ]);

    // Then
    expect(result).toEqual(expectedResult);
    expect(tryCounter).toEqual(2);
  });
});
