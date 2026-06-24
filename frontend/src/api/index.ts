import { createHotelApi, resolveDataSource } from "./createHotelApi";

export type { HotelApi, DataSource, HotelsListParams, RecommendationsParams } from "./types";
export { ApiError, buildQueryString } from "./http/client";
export { createHotelApi, resolveDataSource };

/** Singleton used by hooks and pages. Swap implementation via VITE_DATA_SOURCE. */
export const hotelApi = createHotelApi();

export const activeDataSource = resolveDataSource();
