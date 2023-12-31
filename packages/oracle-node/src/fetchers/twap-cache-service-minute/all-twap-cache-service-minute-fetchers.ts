import { TwapCacheServiceMinuteFetcher } from "./TwapCacheServiceMinuteFetcher";

export const twapCacheServicesMinuteFetchers: {
  [name: string]: TwapCacheServiceMinuteFetcher;
} = {};

const dataServicesIds = [
  "redstone-primary-demo",
  "redstone-primary-prod",
  "redstone-main-demo",
];

for (const dataServiceId of dataServicesIds) {
  const twapCacheServiceFetcher = new TwapCacheServiceMinuteFetcher(
    dataServiceId
  );
  twapCacheServicesMinuteFetchers[twapCacheServiceFetcher.getName()] =
    twapCacheServiceFetcher;
}
