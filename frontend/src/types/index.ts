export interface Amenity {
  id: string;
  name: string;
  slug: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  stars: number;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
  affiliateUrl: string;
  popularityScore: number;
  amenities: Amenity[];
  score?: number;
  matchReasons?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type TravelPurpose = "business" | "family" | "romantic" | "luxury" | "budget";
export type SortOption = "recommended" | "price_asc" | "rating_desc";

export interface SearchParams {
  destination?: string;
  budget?: number;
  purpose?: TravelPurpose;
  minPrice?: number;
  maxPrice?: number;
  minStars?: number;
  maxStars?: number;
  stars?: number;
  minRating?: number;
  amenities?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}
