import { Hotel, PaginatedResponse } from "../../types";

export function paginate<T>(
  items: T[],
  page = 1,
  limit = 20
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const skip = (safePage - 1) * limit;

  return {
    data: items.slice(skip, skip + limit),
    pagination: { page: safePage, limit, total, totalPages },
  };
}

export function matchesDestination(hotel: Hotel, destination?: string): boolean {
  if (!destination?.trim()) return true;
  const term = destination.trim().toLowerCase();
  return (
    hotel.city.toLowerCase().includes(term) ||
    hotel.country.toLowerCase().includes(term)
  );
}

export function resolveAmenitySlugs(amenitiesParam?: string): string[] {
  if (!amenitiesParam) return [];
  return amenitiesParam
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function hotelHasAmenities(hotel: Hotel, slugs: string[]): boolean {
  if (slugs.length === 0) return true;
  const hotelSlugs = new Set(hotel.amenities.map((a) => a.slug.toLowerCase()));
  return slugs.every((slug) => hotelSlugs.has(slug));
}

export interface HotelFilterParams {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  minStars?: number;
  maxStars?: number;
  minRating?: number;
  amenities?: string;
}

export function filterHotels(hotels: Hotel[], params: HotelFilterParams): Hotel[] {
  const amenitySlugs = resolveAmenitySlugs(params.amenities);

  return hotels.filter((hotel) => {
    if (!matchesDestination(hotel, params.destination)) return false;
    if (params.minPrice !== undefined && hotel.pricePerNight < params.minPrice) return false;
    if (params.maxPrice !== undefined && hotel.pricePerNight > params.maxPrice) return false;
    if (params.minStars !== undefined && hotel.stars < params.minStars) return false;
    if (params.maxStars !== undefined && hotel.stars > params.maxStars) return false;
    if (params.minRating !== undefined && hotel.rating < params.minRating) return false;
    if (!hotelHasAmenities(hotel, amenitySlugs)) return false;
    return true;
  });
}

export function sortHotels(
  hotels: Hotel[],
  sort: "recommended" | "price_asc" | "rating_desc" = "recommended"
): Hotel[] {
  const copy = [...hotels];
  if (sort === "price_asc") {
    return copy.sort((a, b) => a.pricePerNight - b.pricePerNight);
  }
  if (sort === "rating_desc") {
    return copy.sort((a, b) => b.rating - a.rating);
  }
  return copy.sort((a, b) => b.popularityScore - a.popularityScore);
}
