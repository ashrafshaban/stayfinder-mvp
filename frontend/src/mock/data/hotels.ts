import { Amenity, Hotel } from "../../types";
import { AMENITY_BY_SLUG, MOCK_AMENITIES } from "./amenities";

const CITIES = [
  { city: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { city: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753 },
] as const;

const PREFIXES = ["Grand", "Royal", "Park", "Central", "Plaza", "Metropolitan", "Harbor", "Sunset", "Emerald", "Sapphire"];
const SUFFIXES = ["Hotel", "Suites", "Inn", "Resort", "Lodge", "Palace", "Tower", "House"];

const CITY_HIGHLIGHTS: Record<string, string> = {
  Cairo: "ancient wonders and vibrant Nile-side culture",
  Dubai: "ultra-modern skyline and world-class shopping",
  London: "historic landmarks and cosmopolitan charm",
  Paris: "romantic boulevards and iconic architecture",
  Istanbul: "where East meets West along the Bosphorus",
  Riyadh: "dynamic capital blending tradition and innovation",
};

/** Featured properties with hand-crafted detail for demos and UI testing. */
const FEATURED_HOTELS: Array<{
  slug: string;
  name: string;
  city: string;
  country: string;
  description: string;
  stars: number;
  rating: number;
  pricePerNight: number;
  popularityScore: number;
  amenitySlugs: string[];
  latOffset: number;
  lngOffset: number;
}> = [
  {
    slug: "nile-ritz-cairo",
    name: "Nile Ritz Cairo",
    city: "Cairo",
    country: "Egypt",
    description:
      "An iconic riverside landmark overlooking the Nile and Egyptian Museum. Marble lobbies, rooftop dining, and concierge-curated pyramid excursions define this five-star classic.",
    stars: 5,
    rating: 9.2,
    pricePerNight: 285,
    popularityScore: 94,
    amenitySlugs: ["wifi", "spa", "pool", "restaurant", "room-service", "business-center", "airport-shuttle", "gym"],
    latOffset: 0.008,
    lngOffset: -0.012,
  },
  {
    slug: "downtown-cairo-inn",
    name: "Downtown Cairo Inn",
    city: "Cairo",
    country: "Egypt",
    description:
      "A smart budget-friendly base in the heart of downtown. Compact rooms, reliable WiFi, and walking distance to Tahrir Square and local cafés.",
    stars: 3,
    rating: 7.4,
    pricePerNight: 72,
    popularityScore: 61,
    amenitySlugs: ["wifi", "breakfast-included", "air-conditioning", "parking"],
    latOffset: -0.006,
    lngOffset: 0.004,
  },
  {
    slug: "burj-view-dubai",
    name: "Burj View Dubai",
    city: "Dubai",
    country: "UAE",
    description:
      "Floor-to-ceiling windows frame the Burj Khalifa from every suite. Infinity pool, award-winning spa, and direct access to Dubai Mall's luxury retail corridor.",
    stars: 5,
    rating: 9.5,
    pricePerNight: 420,
    popularityScore: 97,
    amenitySlugs: ["wifi", "spa", "pool", "restaurant", "bar", "room-service", "gym", "parking"],
    latOffset: 0.01,
    lngOffset: 0.008,
  },
  {
    slug: "marina-family-resort-dubai",
    name: "Marina Family Resort Dubai",
    city: "Dubai",
    country: "UAE",
    description:
      "Spacious family suites steps from Dubai Marina Walk. Kids' club, lagoon pool, and complimentary shuttle to JBR Beach make this a favorite for multi-generational trips.",
    stars: 4,
    rating: 8.6,
    pricePerNight: 198,
    popularityScore: 82,
    amenitySlugs: ["wifi", "pool", "family-room", "breakfast-included", "beach-access", "parking", "restaurant"],
    latOffset: -0.015,
    lngOffset: 0.02,
  },
  {
    slug: "thames-house-london",
    name: "Thames House London",
    city: "London",
    country: "United Kingdom",
    description:
      "Boutique Georgian townhouse hotel near Covent Garden. Afternoon tea lounge, rainfall showers, and bespoke theatre-ticket concierge for West End evenings.",
    stars: 4,
    rating: 8.9,
    pricePerNight: 245,
    popularityScore: 88,
    amenitySlugs: ["wifi", "restaurant", "bar", "room-service", "pet-friendly", "air-conditioning"],
    latOffset: 0.005,
    lngOffset: -0.018,
  },
  {
    slug: "kings-cross-hub-london",
    name: "Kings Cross Hub London",
    city: "London",
    country: "United Kingdom",
    description:
      "Efficient business hotel above St Pancras International. Soundproof rooms, 24-hour gym, and express checkout for Eurostar travelers.",
    stars: 3,
    rating: 7.8,
    pricePerNight: 135,
    popularityScore: 74,
    amenitySlugs: ["wifi", "gym", "business-center", "breakfast-included", "airport-shuttle"],
    latOffset: -0.02,
    lngOffset: 0.01,
  },
  {
    slug: "seine-romance-paris",
    name: "Seine Romance Paris",
    city: "Paris",
    country: "France",
    description:
      "Intimate Left Bank hotel with private balconies overlooking the Seine. Champagne bar, couples spa packages, and a hidden courtyard garden.",
    stars: 4,
    rating: 9.0,
    pricePerNight: 310,
    popularityScore: 91,
    amenitySlugs: ["wifi", "spa", "restaurant", "bar", "room-service", "air-conditioning"],
    latOffset: 0.012,
    lngOffset: -0.006,
  },
  {
    slug: "montmartre-budget-paris",
    name: "Montmartre Budget Paris",
    city: "Paris",
    country: "France",
    description:
      "Charming attic rooms beneath Sacré-Cœur. Shared kitchenette, croissant breakfast, and unbeatable value for artists' quarter explorers.",
    stars: 2,
    rating: 7.1,
    pricePerNight: 89,
    popularityScore: 55,
    amenitySlugs: ["wifi", "breakfast-included", "pet-friendly"],
    latOffset: -0.008,
    lngOffset: 0.014,
  },
  {
    slug: "bosphorus-palace-istanbul",
    name: "Bosphorus Palace Istanbul",
    city: "Istanbul",
    country: "Turkey",
    description:
      "Ottoman-inspired luxury on the European shore. Hammam spa, rooftop meze restaurant, and private pier for sunset Bosphorus cruises.",
    stars: 5,
    rating: 9.3,
    pricePerNight: 275,
    popularityScore: 90,
    amenitySlugs: ["wifi", "spa", "pool", "restaurant", "bar", "room-service", "airport-shuttle", "gym"],
    latOffset: 0.018,
    lngOffset: -0.01,
  },
  {
    slug: "sultanahmet-boutique-istanbul",
    name: "Sultanahmet Boutique Istanbul",
    city: "Istanbul",
    country: "Turkey",
    description:
      "Restored stone mansion minutes from Hagia Sophia. Terrace breakfast with mosque views, Turkish coffee ritual, and guided Old City walks.",
    stars: 4,
    rating: 8.4,
    pricePerNight: 165,
    popularityScore: 79,
    amenitySlugs: ["wifi", "restaurant", "breakfast-included", "air-conditioning", "family-room"],
    latOffset: -0.004,
    lngOffset: 0.006,
  },
  {
    slug: "kingdom-tower-riyadh",
    name: "Kingdom Tower Riyadh",
    city: "Riyadh",
    country: "Saudi Arabia",
    description:
      "Premium business hotel linked to Kingdom Centre. Executive lounge, prayer facilities, and panoramic city views from the sky bridge level.",
    stars: 5,
    rating: 8.8,
    pricePerNight: 320,
    popularityScore: 86,
    amenitySlugs: ["wifi", "spa", "gym", "business-center", "restaurant", "room-service", "parking", "airport-shuttle"],
    latOffset: 0.007,
    lngOffset: -0.005,
  },
  {
    slug: "diplomatic-quarter-riyadh",
    name: "Diplomatic Quarter Riyadh",
    city: "Riyadh",
    country: "Saudi Arabia",
    description:
      "Quiet compound-style lodging in the Diplomatic Quarter. Landscaped gardens, family villas, and easy access to embassies and business parks.",
    stars: 4,
    rating: 8.1,
    pricePerNight: 185,
    popularityScore: 70,
    amenitySlugs: ["wifi", "pool", "family-room", "parking", "gym", "restaurant", "breakfast-included"],
    latOffset: -0.012,
    lngOffset: 0.016,
  },
];

function deterministicUuid(index: number): string {
  const hex = index.toString(16).padStart(12, "0");
  return `a1000000-0000-4000-8000-${hex}`;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function resolveAmenities(slugs: string[]): Amenity[] {
  return slugs
    .map((slug) => AMENITY_BY_SLUG.get(slug))
    .filter((a): a is Amenity => a !== undefined);
}

function buildDescription(name: string, city: string, stars: number): string {
  const highlight = CITY_HIGHLIGHTS[city] ?? "local attractions and culture";
  const tier =
    stars >= 5 ? "Luxury" : stars >= 4 ? "Upscale" : stars >= 3 ? "Comfortable" : "Affordable";
  return `${name} is a ${tier.toLowerCase()} stay in ${city}, ideal for travelers exploring ${highlight}. Expect attentive service, well-appointed rooms, and a location that puts the city's best experiences within easy reach.`;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function pickAmenities(rand: () => number, count: number): string[] {
  const slugs = MOCK_AMENITIES.map((a) => a.slug);
  const picked = new Set<string>();
  while (picked.size < count && picked.size < slugs.length) {
    picked.add(slugs[Math.floor(rand() * slugs.length)]);
  }
  return Array.from(picked);
}

function buildGeneratedHotels(startIndex: number): Hotel[] {
  const hotels: Hotel[] = [];
  let index = startIndex;

  for (const { city, country, lat, lng } of CITIES) {
    for (let i = 0; i < 10; i++) {
      const prefix = PREFIXES[i % PREFIXES.length];
      const suffix = SUFFIXES[(i + 2) % SUFFIXES.length];
      const name = `${prefix} ${city} ${suffix}`;
      const slug = slugify(name);
      const rand = seededRandom(index * 997 + i * 13);
      const stars = Math.floor(rand() * 5) + 1;
      const rating = Math.round((rand() * 5 + 3 + stars * 0.3) * 10) / 10;
      const pricePerNight = Math.round(60 + stars * 35 + rand() * 120);
      const popularityScore = Math.round(30 + rand() * 65);
      const amenityCount = Math.floor(rand() * 5) + 3;

      hotels.push({
        id: deterministicUuid(index),
        name,
        city,
        country,
        description: buildDescription(name, city, stars),
        stars,
        rating: Math.min(10, rating),
        pricePerNight,
        imageUrl: `https://picsum.photos/seed/${slug}/800/600`,
        latitude: lat + (rand() - 0.5) * 0.04,
        longitude: lng + (rand() - 0.5) * 0.04,
        affiliateUrl: `https://booking.example/h/${slug}?ref=stayfinder-mock`,
        popularityScore,
        amenities: resolveAmenities(pickAmenities(rand, amenityCount)),
      });
      index++;
    }
  }

  return hotels;
}

function buildFeaturedHotels(startIndex: number): Hotel[] {
  return FEATURED_HOTELS.map((featured, i) => {
    const cityMeta = CITIES.find((c) => c.city === featured.city)!;
    const validSlugs = featured.amenitySlugs.filter((s) => AMENITY_BY_SLUG.has(s));
    return {
      id: deterministicUuid(startIndex + i),
      name: featured.name,
      city: featured.city,
      country: featured.country,
      description: featured.description,
      stars: featured.stars,
      rating: featured.rating,
      pricePerNight: featured.pricePerNight,
      imageUrl: `https://picsum.photos/seed/${featured.slug}/800/600`,
      latitude: cityMeta.lat + featured.latOffset,
      longitude: cityMeta.lng + featured.lngOffset,
      affiliateUrl: `https://booking.example/h/${featured.slug}?ref=stayfinder-mock`,
      popularityScore: featured.popularityScore,
      amenities: resolveAmenities(validSlugs),
    };
  });
}

/** Full in-memory catalog — self-contained, no backend dependency. */
export function buildMockCatalog(): Hotel[] {
  const featured = buildFeaturedHotels(1);
  const generated = buildGeneratedHotels(featured.length + 1);
  return [...featured, ...generated];
}

export const MOCK_HOTELS: Hotel[] = buildMockCatalog();

export const MOCK_HOTEL_BY_ID = new Map(MOCK_HOTELS.map((h) => [h.id, h]));
