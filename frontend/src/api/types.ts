import { Amenity, Hotel, PaginatedResponse, SearchParams } from "../types";

export interface AffiliateClickInput {
  hotelId: string;
  sessionId: string;
  source?: string;
}

export interface AffiliateClickResult {
  ok: boolean;
  id: string;
}

export interface RecommendationsParams extends SearchParams {
  destination: string;
  sessionId?: string;
  stars?: number;
}

export interface HotelsListParams extends SearchParams {
  sessionId?: string;
  stars?: number;
}

/** Contract for hotel data access. UI code depends on this, not on HTTP or mock internals. */
export interface HotelApi {
  getAmenities(): Promise<Amenity[]>;
  listHotels(params: HotelsListParams): Promise<PaginatedResponse<Hotel>>;
  getRecommendations(params: RecommendationsParams): Promise<PaginatedResponse<Hotel>>;
  getHotelById(id: string): Promise<Hotel>;
  trackAffiliateClick(input: AffiliateClickInput): Promise<AffiliateClickResult>;
}

export type DataSource = "api" | "mock";
