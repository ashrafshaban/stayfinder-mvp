import { useQuery } from "@tanstack/react-query";
import { apiFetch, buildQueryString } from "../api/client";
import { useSessionId } from "./useSessionId";
import { Hotel, PaginatedResponse, SearchParams } from "../types";

export function useAmenities() {
  return useQuery({
    queryKey: ["amenities"],
    queryFn: () => apiFetch<{ id: string; name: string; slug: string }[]>("/api/amenities"),
  });
}

export function useHotels(params: SearchParams) {
  const sessionId = useSessionId();
  const queryString = buildQueryString({ ...params, sessionId });

  return useQuery({
    queryKey: ["hotels", params],
    queryFn: () => apiFetch<PaginatedResponse<Hotel>>(`/api/hotels${queryString}`),
    enabled: !!params.destination,
  });
}

export function useRecommendations(params: SearchParams) {
  const sessionId = useSessionId();
  const queryString = buildQueryString({ ...params, sessionId });

  return useQuery({
    queryKey: ["recommendations", params],
    queryFn: () => apiFetch<PaginatedResponse<Hotel>>(`/api/recommendations${queryString}`),
    enabled: !!params.destination,
  });
}

export function useHotel(id: string) {
  return useQuery({
    queryKey: ["hotel", id],
    queryFn: () => apiFetch<Hotel>(`/api/hotels/${id}`),
    enabled: !!id,
  });
}

export async function trackAffiliateClick(hotelId: string, sessionId: string) {
  return apiFetch("/api/affiliate/click", {
    method: "POST",
    body: JSON.stringify({ hotelId, sessionId, source: "web" }),
  });
}
