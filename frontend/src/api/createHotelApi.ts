import { DataSource, HotelApi } from "./types";
import { createHttpHotelApi } from "./http/hotelApi";
import { createMockHotelApi } from "../mock/mockHotelApi";

export function resolveDataSource(): DataSource {
  const raw = import.meta.env.VITE_DATA_SOURCE?.toLowerCase();
  if (raw === "mock" || raw === "api") return raw;
  if (import.meta.env.VITE_USE_MOCK_API === "true") return "mock";
  return "api";
}

export function createHotelApi(source: DataSource = resolveDataSource()): HotelApi {
  switch (source) {
    case "mock":
      return createMockHotelApi();
    case "api":
    default:
      return createHttpHotelApi();
  }
}
