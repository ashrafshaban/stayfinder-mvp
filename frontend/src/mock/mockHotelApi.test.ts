import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockHotelApi } from "./mockHotelApi";
import { MOCK_HOTELS } from "./data/hotels";

describe("mockHotelApi", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_MOCK_LATENCY_MS", "0");
  });

  const api = createMockHotelApi();

  it("returns amenities catalog", async () => {
    const amenities = await api.getAmenities();
    expect(amenities.length).toBeGreaterThan(10);
    expect(amenities[0]).toMatchObject({ id: expect.any(String), name: expect.any(String), slug: expect.any(String) });
  });

  it("filters hotels by destination", async () => {
    const result = await api.listHotels({ destination: "Cairo", page: 1, limit: 50 });
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data.every((h) => h.city === "Cairo" || h.country.toLowerCase().includes("egypt"))).toBe(true);
  });

  it("returns recommendations with scores", async () => {
    const result = await api.getRecommendations({
      destination: "Dubai",
      budget: 200,
      purpose: "family",
    });
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].score).toBeGreaterThan(0);
    expect(result.data[0].matchReasons?.length).toBeGreaterThan(0);
  });

  it("returns hotel by id", async () => {
    const sample = MOCK_HOTELS[0];
    const hotel = await api.getHotelById(sample.id);
    expect(hotel.id).toBe(sample.id);
    expect(hotel.name).toBe(sample.name);
  });

  it("throws for unknown hotel id", async () => {
    await expect(api.getHotelById("00000000-0000-0000-0000-000000000000")).rejects.toThrow("Hotel not found");
  });

  it("tracks affiliate clicks", async () => {
    const sample = MOCK_HOTELS[0];
    const result = await api.trackAffiliateClick({
      hotelId: sample.id,
      sessionId: "test-session",
    });
    expect(result.ok).toBe(true);
  });
});
