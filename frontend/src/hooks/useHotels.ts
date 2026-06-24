import { useQuery } from "@tanstack/react-query";
import { hotelApi } from "../api";
import { useSessionId } from "./useSessionId";
import { SearchParams } from "../types";

export function useAmenities() {
  return useQuery({
    queryKey: ["amenities"],
    queryFn: () => hotelApi.getAmenities(),
  });
}

export function useHotels(params: SearchParams) {
  const sessionId = useSessionId();

  return useQuery({
    queryKey: ["hotels", params],
    queryFn: () =>
      hotelApi.listHotels({
        ...params,
        stars: params.minStars,
        sessionId,
      }),
    enabled: !!params.destination,
  });
}

export function useRecommendations(params: SearchParams) {
  const sessionId = useSessionId();

  return useQuery({
    queryKey: ["recommendations", params],
    queryFn: () =>
      hotelApi.getRecommendations({
        destination: params.destination!,
        budget: params.budget,
        purpose: params.purpose,
        stars: params.minStars,
        minRating: params.minRating,
        amenities: params.amenities,
        page: params.page,
        limit: params.limit,
        sessionId,
      }),
    enabled: !!params.destination,
  });
}

export function useHotel(id: string) {
  return useQuery({
    queryKey: ["hotel", id],
    queryFn: () => hotelApi.getHotelById(id),
    enabled: !!id,
  });
}

export async function trackAffiliateClick(hotelId: string, sessionId: string) {
  return hotelApi.trackAffiliateClick({ hotelId, sessionId, source: "web" });
}
