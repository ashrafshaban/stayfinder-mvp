import { describe, it, expect } from "vitest";
import {
  computePriceMatch,
  computeStarMatch,
  computeAmenitiesMatch,
  scoreHotel,
} from "../recommendation.service";

describe("computePriceMatch", () => {
  it("returns 0.5 when no budget", () => {
    expect(computePriceMatch(100)).toBe(0.5);
  });

  it("returns 1 for exact budget match", () => {
    expect(computePriceMatch(150, 150)).toBe(1);
  });

  it("boosts budget purpose when under budget", () => {
    const match = computePriceMatch(80, 100, "budget");
    expect(match).toBeGreaterThan(0.9);
  });
});

describe("computeStarMatch", () => {
  it("returns 0.5 when no preference", () => {
    expect(computeStarMatch(4)).toBe(0.5);
  });

  it("returns 1 when stars meet preference", () => {
    expect(computeStarMatch(5, 4)).toBe(1);
  });

  it("uses luxury default of 4 stars", () => {
    expect(computeStarMatch(4, undefined, "luxury")).toBe(1);
    expect(computeStarMatch(3, undefined, "luxury")).toBeLessThan(1);
  });
});

describe("computeAmenitiesMatch", () => {
  it("returns 0.5 when no preferred amenities", () => {
    expect(computeAmenitiesMatch(["wifi", "pool"])).toBe(0.5);
  });

  it("calculates intersection ratio", () => {
    expect(computeAmenitiesMatch(["wifi", "pool", "spa"], ["wifi", "pool"])).toBe(1);
  });

  it("uses purpose amenities when none specified", () => {
    const match = computeAmenitiesMatch(["wifi", "business-center"], undefined, "business");
    expect(match).toBeGreaterThan(0.5);
  });
});

describe("scoreHotel", () => {
  const baseHotel = {
    stars: 4,
    rating: 8.5,
    pricePerNight: 150,
    popularityScore: 75,
    amenitySlugs: ["wifi", "pool", "spa"],
  };

  it("returns score between 0 and 100", () => {
    const result = scoreHotel(baseHotel, { budget: 150, stars: 4, amenities: ["wifi"] });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("includes match reasons", () => {
    const result = scoreHotel(baseHotel, { budget: 150, stars: 4 });
    expect(result.matchReasons.length).toBeGreaterThan(0);
  });

  it("scores higher for better budget match", () => {
    const close = scoreHotel(baseHotel, { budget: 150 }).score;
    const far = scoreHotel({ ...baseHotel, pricePerNight: 400 }, { budget: 150 }).score;
    expect(close).toBeGreaterThan(far);
  });
});
