import { TravelPurpose } from "../validators/schemas";

export interface ScoringWeights {
  price: number;
  star: number;
  amenities: number;
  userRating: number;
  popularity: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  price: 30,
  star: 20,
  amenities: 25,
  userRating: 15,
  popularity: 10,
};

export interface HotelForScoring {
  stars: number;
  rating: number;
  pricePerNight: number;
  popularityScore: number;
  amenitySlugs: string[];
}

export interface ScoringPreferences {
  budget?: number;
  stars?: number;
  amenities?: string[];
  purpose?: TravelPurpose;
}

export interface ScoreResult {
  score: number;
  matchReasons: string[];
  breakdown: {
    priceMatch: number;
    starMatch: number;
    amenitiesMatch: number;
    userRatingNorm: number;
    popularityNorm: number;
  };
}

const PURPOSE_AMENITY_BOOSTS: Record<TravelPurpose, string[]> = {
  business: ["wifi", "business-center", "airport-shuttle"],
  family: ["pool", "family-room", "breakfast-included"],
  romantic: ["spa", "restaurant", "bar"],
  luxury: ["spa", "pool", "room-service"],
  budget: ["wifi", "breakfast-included", "parking"],
};

export function computePriceMatch(price: number, budget?: number, purpose?: TravelPurpose): number {
  if (!budget || budget <= 0) return 0.5;

  const diff = Math.abs(price - budget);
  let match = 1 - Math.min(diff / budget, 1);

  if (purpose === "budget" && price <= budget) {
    match = Math.min(1, match + 0.15);
  }
  if (purpose === "luxury" && price >= budget) {
    const overRatio = (price - budget) / budget;
    match = Math.max(match, 0.7 - Math.min(overRatio, 0.5) * 0.3);
  }

  return Math.max(0, Math.min(1, match));
}

export function computeStarMatch(stars: number, preferred?: number, purpose?: TravelPurpose): number {
  const target = preferred ?? (purpose === "luxury" ? 4 : purpose === "budget" ? 3 : undefined);
  if (!target) return 0.5;

  if (stars >= target) return 1;
  const decay = (target - stars) / target;
  return Math.max(0, 1 - decay);
}

export function computeAmenitiesMatch(
  hotelSlugs: string[],
  preferred?: string[],
  purpose?: TravelPurpose
): number {
  const hotelSet = new Set(hotelSlugs.map((s) => s.toLowerCase()));
  let preferredList = preferred?.map((s) => s.toLowerCase()) ?? [];

  if (purpose && preferredList.length === 0) {
    preferredList = PURPOSE_AMENITY_BOOSTS[purpose];
  }

  if (preferredList.length === 0) return 0.5;

  const intersection = preferredList.filter((a) => hotelSet.has(a));
  let base = intersection.length / preferredList.length;

  if (purpose) {
    const boostAmenities = PURPOSE_AMENITY_BOOSTS[purpose];
    const boostHits = boostAmenities.filter((a) => hotelSet.has(a)).length;
    base = Math.min(1, base + (boostHits / boostAmenities.length) * 0.2);
  }

  return base;
}

export function computeUserRatingNorm(rating: number): number {
  return Math.max(0, Math.min(1, rating / 10));
}

export function computePopularityNorm(popularityScore: number): number {
  return Math.max(0, Math.min(1, popularityScore / 100));
}

export function buildMatchReasons(
  hotel: HotelForScoring,
  prefs: ScoringPreferences,
  breakdown: ScoreResult["breakdown"]
): string[] {
  const reasons: string[] = [];

  if (prefs.budget && breakdown.priceMatch >= 0.7) {
    reasons.push("Matches your budget");
  } else if (prefs.purpose === "budget" && hotel.pricePerNight <= (prefs.budget ?? hotel.pricePerNight)) {
    reasons.push("Great value for money");
  }

  if (prefs.stars && hotel.stars >= prefs.stars) {
    reasons.push(`${hotel.stars}-star rating meets your preference`);
  } else if (prefs.purpose === "luxury" && hotel.stars >= 4) {
    reasons.push("Premium luxury property");
  }

  if (breakdown.amenitiesMatch >= 0.6 && prefs.amenities?.length) {
    const matched = prefs.amenities.filter((a) =>
      hotel.amenitySlugs.map((s) => s.toLowerCase()).includes(a.toLowerCase())
    );
    if (matched.length > 0) {
      reasons.push(`Has ${matched.slice(0, 3).join(", ")}`);
    }
  } else if (prefs.purpose) {
    const boostAmenities = PURPOSE_AMENITY_BOOSTS[prefs.purpose];
    const matched = boostAmenities.filter((a) =>
      hotel.amenitySlugs.map((s) => s.toLowerCase()).includes(a)
    );
    if (matched.length > 0) {
      reasons.push(`Ideal for ${prefs.purpose} travel`);
    }
  }

  if (hotel.rating >= 8) {
    reasons.push("Highly rated by guests");
  }

  if (reasons.length === 0) {
    reasons.push("Popular choice in this destination");
  }

  return reasons.slice(0, 3);
}

export function scoreHotel(
  hotel: HotelForScoring,
  prefs: ScoringPreferences,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): ScoreResult {
  const priceMatch = computePriceMatch(hotel.pricePerNight, prefs.budget, prefs.purpose);
  const starMatch = computeStarMatch(hotel.stars, prefs.stars, prefs.purpose);
  const amenitiesMatch = computeAmenitiesMatch(hotel.amenitySlugs, prefs.amenities, prefs.purpose);
  const userRatingNorm = computeUserRatingNorm(hotel.rating);
  const popularityNorm = computePopularityNorm(hotel.popularityScore);

  let weighted =
    priceMatch * weights.price +
    starMatch * weights.star +
    amenitiesMatch * weights.amenities +
    userRatingNorm * weights.userRating +
    popularityNorm * weights.popularity;

  if (prefs.purpose === "budget") {
    weighted = weighted * 0.85 + priceMatch * weights.price * 0.15;
  }

  const maxWeight = weights.price + weights.star + weights.amenities + weights.userRating + weights.popularity;
  const score = Math.round((weighted / maxWeight) * 100);

  const breakdown = { priceMatch, starMatch, amenitiesMatch, userRatingNorm, popularityNorm };
  const matchReasons = buildMatchReasons(hotel, prefs, breakdown);

  return { score, matchReasons, breakdown };
}

export function sortByScore<T extends { score: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.score - a.score);
}
