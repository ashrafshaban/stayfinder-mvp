import {
  HotelApi,
  AffiliateClickInput,
  AffiliateClickResult,
  HotelsListParams,
  RecommendationsParams,
} from "../api/types";
import { Hotel } from "../types";
import { ApiError } from "../api/http/client";
import { MOCK_AMENITIES } from "./data/amenities";
import { MOCK_HOTELS, MOCK_HOTEL_BY_ID } from "./data/hotels";
import { filterHotels, paginate, resolveAmenitySlugs, sortHotels } from "./logic/filters";
import { scoreHotel, sortByScore } from "./logic/scoring";
import { mockDelay } from "./delay";

const affiliateClicks: AffiliateClickResult[] = [];

function withScores(
  hotels: Hotel[],
  prefs: {
    budget?: number;
    stars?: number;
    purpose?: RecommendationsParams["purpose"];
    amenities?: string;
  }
): Hotel[] {
  const amenitySlugs = resolveAmenitySlugs(prefs.amenities);
  return hotels.map((hotel) => {
    const { score, matchReasons } = scoreHotel(
      {
        stars: hotel.stars,
        rating: hotel.rating,
        pricePerNight: hotel.pricePerNight,
        popularityScore: hotel.popularityScore,
        amenitySlugs: hotel.amenities.map((a) => a.slug),
      },
      {
        budget: prefs.budget,
        stars: prefs.stars,
        purpose: prefs.purpose,
        amenities: amenitySlugs.length > 0 ? amenitySlugs : undefined,
      }
    );
    return { ...hotel, score, matchReasons };
  });
}

function hasRecommendationContext(params: HotelsListParams): boolean {
  return (
    params.sort === "recommended" &&
    (params.budget !== undefined ||
      params.stars !== undefined ||
      params.purpose !== undefined ||
      !!params.amenities)
  );
}

export function createMockHotelApi(): HotelApi {
  return {
    async getAmenities() {
      await mockDelay();
      return [...MOCK_AMENITIES];
    },

    async listHotels(params: HotelsListParams) {
      await mockDelay();
      const page = params.page ?? 1;
      const limit = params.limit ?? 20;

      let results = filterHotels(MOCK_HOTELS, params);

      if (hasRecommendationContext(params)) {
        const scored = withScores(results, params);
        const sorted = sortByScore(scored);
        return paginate(sorted, page, limit);
      }

      results = sortHotels(results, params.sort ?? "recommended");
      return paginate(results, page, limit);
    },

    async getRecommendations(params: RecommendationsParams) {
      await mockDelay();
      if (!params.destination?.trim()) {
        throw new ApiError("destination is required", 400);
      }

      const page = params.page ?? 1;
      const limit = params.limit ?? 20;
      const filtered = filterHotels(MOCK_HOTELS, params);
      const scored = withScores(filtered, params);
      const sorted = sortByScore(scored);
      return paginate(sorted, page, limit);
    },

    async getHotelById(id: string) {
      await mockDelay();
      const hotel = MOCK_HOTEL_BY_ID.get(id);
      if (!hotel) {
        throw new ApiError("Hotel not found", 404);
      }
      return { ...hotel };
    },

    async trackAffiliateClick(input: AffiliateClickInput) {
      await mockDelay(150);
      if (!MOCK_HOTEL_BY_ID.has(input.hotelId)) {
        throw new ApiError("Hotel not found", 404);
      }
      const result: AffiliateClickResult = {
        ok: true,
        id: `mock-click-${affiliateClicks.length + 1}`,
      };
      affiliateClicks.push(result);
      return result;
    },
  };
}
