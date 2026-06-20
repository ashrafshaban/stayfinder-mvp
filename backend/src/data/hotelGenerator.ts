export const AMENITY_DEFINITIONS = [
  { name: "WiFi", slug: "wifi" },
  { name: "Pool", slug: "pool" },
  { name: "Spa", slug: "spa" },
  { name: "Gym", slug: "gym" },
  { name: "Restaurant", slug: "restaurant" },
  { name: "Parking", slug: "parking" },
  { name: "Air Conditioning", slug: "air-conditioning" },
  { name: "Room Service", slug: "room-service" },
  { name: "Business Center", slug: "business-center" },
  { name: "Family Room", slug: "family-room" },
  { name: "Pet Friendly", slug: "pet-friendly" },
  { name: "Airport Shuttle", slug: "airport-shuttle" },
  { name: "Bar", slug: "bar" },
  { name: "Breakfast Included", slug: "breakfast-included" },
  { name: "Beach Access", slug: "beach-access" },
] as const;

export const CITIES = [
  { city: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { city: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753 },
] as const;

export const HOTEL_PREFIXES = [
  "Grand",
  "Royal",
  "Park",
  "Central",
  "Plaza",
  "Metropolitan",
  "Harbor",
  "Sunset",
  "Emerald",
  "Sapphire",
];

export const HOTEL_SUFFIXES = [
  "Hotel",
  "Suites",
  "Inn",
  "Resort",
  "Lodge",
  "Palace",
  "Tower",
  "House",
];

export interface SeedHotelInput {
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
  amenitySlugs: string[];
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function pickRandom<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

function pickAmenities(seed: number, count: number): string[] {
  const slugs = AMENITY_DEFINITIONS.map((a) => a.slug);
  const selected = new Set<string>();
  for (let i = 0; i < count; i++) {
    selected.add(slugs[(seed + i * 7) % slugs.length]);
  }
  return Array.from(selected);
}

export function generateHotels(countPerCity = 20): SeedHotelInput[] {
  const hotels: SeedHotelInput[] = [];
  let index = 0;

  for (const location of CITIES) {
    for (let i = 0; i < countPerCity; i++) {
      const prefix = pickRandom(HOTEL_PREFIXES, index + i);
      const suffix = pickRandom(HOTEL_SUFFIXES, index + i + 3);
      const name = `${prefix} ${location.city} ${suffix}`;
      const stars = 2 + ((index + i) % 4);
      const rating = Math.round((3.5 + ((index + i * 3) % 60) / 10) * 10) / 10;
      const pricePerNight = Math.round(40 + stars * 35 + ((index + i * 11) % 400));
      const popularityScore = 30 + ((index + i * 13) % 71);
      const latOffset = ((index % 10) - 5) * 0.01;
      const lngOffset = ((i % 10) - 5) * 0.01;
      const slug = slugify(name);

      hotels.push({
        name,
        city: location.city,
        country: location.country,
        description: `${name} offers comfortable accommodations in the heart of ${location.city}. Enjoy modern amenities, excellent service, and a prime location for ${location.country === "Egypt" ? "exploring ancient wonders" : "business and leisure travelers"}. Perfect for short stays and extended visits alike.`,
        stars,
        rating: Math.min(rating, 9.8),
        pricePerNight,
        imageUrl: `https://picsum.photos/seed/${slug}/800/600`,
        latitude: location.lat + latOffset,
        longitude: location.lng + lngOffset,
        affiliateUrl: `https://booking.example/h/${slug}?ref=mvp`,
        popularityScore,
        amenitySlugs: pickAmenities(index + i, 3 + ((index + i) % 6)),
      });
      index++;
    }
  }

  return hotels;
}
