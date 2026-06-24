import { HotelApi, AffiliateClickInput, AffiliateClickResult, HotelsListParams, RecommendationsParams } from "../types";
import { Amenity, Hotel, PaginatedResponse } from "../../types";
import { apiFetch, buildQueryString } from "./client";

export function createHttpHotelApi(): HotelApi {
  return {
    getAmenities() {
      return apiFetch<Amenity[]>("/api/amenities");
    },

    listHotels(params: HotelsListParams) {
      const queryString = buildQueryString({ ...params, sessionId: params.sessionId });
      return apiFetch<PaginatedResponse<Hotel>>(`/api/hotels${queryString}`);
    },

    getRecommendations(params: RecommendationsParams) {
      const queryString = buildQueryString({ ...params, sessionId: params.sessionId });
      return apiFetch<PaginatedResponse<Hotel>>(`/api/recommendations${queryString}`);
    },

    getHotelById(id: string) {
      return apiFetch<Hotel>(`/api/hotels/${id}`);
    },

    trackAffiliateClick(input: AffiliateClickInput) {
      return apiFetch<AffiliateClickResult>("/api/affiliate/click", {
        method: "POST",
        body: JSON.stringify({
          hotelId: input.hotelId,
          sessionId: input.sessionId,
          source: input.source ?? "web",
        }),
      });
    },
  };
}
