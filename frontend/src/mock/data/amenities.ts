import { Amenity } from "../../types";

export const MOCK_AMENITIES: Amenity[] = [
  { id: "am-001", name: "WiFi", slug: "wifi" },
  { id: "am-002", name: "Pool", slug: "pool" },
  { id: "am-003", name: "Spa", slug: "spa" },
  { id: "am-004", name: "Gym", slug: "gym" },
  { id: "am-005", name: "Restaurant", slug: "restaurant" },
  { id: "am-006", name: "Parking", slug: "parking" },
  { id: "am-007", name: "Air Conditioning", slug: "air-conditioning" },
  { id: "am-008", name: "Room Service", slug: "room-service" },
  { id: "am-009", name: "Business Center", slug: "business-center" },
  { id: "am-010", name: "Family Room", slug: "family-room" },
  { id: "am-011", name: "Pet Friendly", slug: "pet-friendly" },
  { id: "am-012", name: "Airport Shuttle", slug: "airport-shuttle" },
  { id: "am-013", name: "Bar", slug: "bar" },
  { id: "am-014", name: "Breakfast Included", slug: "breakfast-included" },
  { id: "am-015", name: "Beach Access", slug: "beach-access" },
];

export const AMENITY_BY_SLUG = new Map(MOCK_AMENITIES.map((a) => [a.slug, a]));
