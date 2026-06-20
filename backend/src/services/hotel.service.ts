import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { HotelsQuery } from "../validators/schemas";
import { ScoreResult, scoreHotel, sortByScore } from "./recommendation.service";

type ScoredHotel = { hotel: HotelWithAmenities } & ScoreResult;

const hotelInclude = {
  amenities: { include: { amenity: true } },
} satisfies Prisma.HotelInclude;

export type HotelWithAmenities = Prisma.HotelGetPayload<{ include: typeof hotelInclude }>;

export function formatHotel(hotel: HotelWithAmenities, extra?: { score?: number; matchReasons?: string[] }) {
  return {
    id: hotel.id,
    name: hotel.name,
    city: hotel.city,
    country: hotel.country,
    description: hotel.description,
    stars: hotel.stars,
    rating: hotel.rating,
    pricePerNight: hotel.pricePerNight,
    imageUrl: hotel.imageUrl,
    latitude: hotel.latitude,
    longitude: hotel.longitude,
    affiliateUrl: hotel.affiliateUrl,
    popularityScore: hotel.popularityScore,
    amenities: hotel.amenities.map((ha) => ({
      id: ha.amenity.id,
      name: ha.amenity.name,
      slug: ha.amenity.slug,
    })),
    ...extra,
  };
}

async function resolveAmenityIds(amenitiesParam?: string): Promise<string[]> {
  if (!amenitiesParam) return [];
  const slugs = amenitiesParam.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (slugs.length === 0) return [];

  const amenities = await prisma.amenity.findMany({
    where: {
      OR: [{ slug: { in: slugs } }, { id: { in: slugs } }],
    },
  });
  return amenities.map((a) => a.id);
}

function buildWhere(query: HotelsQuery, amenityIds: string[]): Prisma.HotelWhereInput {
  const where: Prisma.HotelWhereInput = {};

  if (query.destination) {
    where.OR = [
      { city: { contains: query.destination, mode: "insensitive" } },
      { country: { contains: query.destination, mode: "insensitive" } },
    ];
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.pricePerNight = {};
    if (query.minPrice !== undefined) where.pricePerNight.gte = query.minPrice;
    if (query.maxPrice !== undefined) where.pricePerNight.lte = query.maxPrice;
  }

  if (query.minStars !== undefined || query.maxStars !== undefined) {
    where.stars = {};
    if (query.minStars !== undefined) where.stars.gte = query.minStars;
    if (query.maxStars !== undefined) where.stars.lte = query.maxStars;
  }

  if (query.minRating !== undefined) {
    where.rating = { gte: query.minRating };
  }

  if (amenityIds.length > 0) {
    where.AND = amenityIds.map((id) => ({
      amenities: { some: { amenityId: id } },
    }));
  }

  return where;
}

export async function listHotels(query: HotelsQuery) {
  const amenityIds = await resolveAmenityIds(query.amenities);
  const where = buildWhere(query, amenityIds);
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const hasRecommendationContext =
    query.sort === "recommended" &&
    (query.budget !== undefined || query.stars !== undefined || query.purpose !== undefined || !!query.amenities);

  if (hasRecommendationContext) {
    const hotels = await prisma.hotel.findMany({ where, include: hotelInclude });
    const amenitySlugs = query.amenities?.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

    const scored: ScoredHotel[] = hotels.map((hotel) => {
      const result = scoreHotel(
        {
          stars: hotel.stars,
          rating: hotel.rating,
          pricePerNight: hotel.pricePerNight,
          popularityScore: hotel.popularityScore,
          amenitySlugs: hotel.amenities.map((ha) => ha.amenity.slug),
        },
        {
          budget: query.budget,
          stars: query.stars,
          purpose: query.purpose,
          amenities: amenitySlugs,
        }
      );
      return { hotel, ...result };
    });

    const sorted = sortByScore(scored);
    const paginated = sorted.slice(skip, skip + limit);

    return {
      data: paginated.map(({ hotel, score, matchReasons }) =>
        formatHotel(hotel, { score, matchReasons })
      ),
      pagination: { page, limit, total: sorted.length, totalPages: Math.ceil(sorted.length / limit) },
    };
  }

  let orderBy: Prisma.HotelOrderByWithRelationInput = { popularityScore: "desc" };
  if (query.sort === "price_asc") orderBy = { pricePerNight: "asc" };
  if (query.sort === "rating_desc") orderBy = { rating: "desc" };

  const [hotels, total] = await Promise.all([
    prisma.hotel.findMany({ where, include: hotelInclude, orderBy, skip, take: limit }),
    prisma.hotel.count({ where }),
  ]);

  return {
    data: hotels.map((h) => formatHotel(h)),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getHotelById(id: string) {
  const hotel = await prisma.hotel.findUnique({ where: { id }, include: hotelInclude });
  if (!hotel) throw new Error("Hotel not found");
  return formatHotel(hotel);
}

export async function logSearchEvent(params: {
  sessionId?: string;
  destination?: string;
  budget?: number;
  purpose?: string;
  filters: Record<string, unknown>;
  resultCount: number;
}) {
  if (!params.destination) return;
  await prisma.searchEvent.create({
    data: {
      sessionId: params.sessionId,
      destination: params.destination,
      budget: params.budget,
      purpose: params.purpose,
      filters: params.filters as Prisma.InputJsonValue,
      resultCount: params.resultCount,
    },
  });
}
