import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { RecommendationsQuery } from "../validators/schemas";
import { formatHotel, HotelWithAmenities } from "./hotel.service";
import { ScoreResult, scoreHotel, sortByScore } from "./recommendation.service";

type ScoredHotel = { hotel: HotelWithAmenities } & ScoreResult;

const hotelInclude = {
  amenities: { include: { amenity: true } },
};

export async function getRecommendations(query: RecommendationsQuery) {
  const where: Prisma.HotelWhereInput = {
    OR: [
      { city: { contains: query.destination, mode: "insensitive" } },
      { country: { contains: query.destination, mode: "insensitive" } },
    ],
  };

  if (query.minRating !== undefined) {
    where.rating = { gte: query.minRating };
  }

  const amenitySlugs = query.amenities?.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) ?? [];

  if (amenitySlugs.length > 0) {
    const amenities = await prisma.amenity.findMany({
      where: { slug: { in: amenitySlugs } },
    });
    where.AND = amenities.map((a) => ({
      amenities: { some: { amenityId: a.id } },
    }));
  }

  const hotels = await prisma.hotel.findMany({ where, include: hotelInclude });

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
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;
  const paginated = sorted.slice(skip, skip + limit);

  await prisma.recommendationEvent.create({
    data: {
      sessionId: query.sessionId,
      query: query as unknown as Prisma.InputJsonValue,
      resultCount: sorted.length,
    },
  });

  return {
    data: paginated.map(({ hotel, score, matchReasons }) =>
      formatHotel(hotel, { score, matchReasons })
    ),
    pagination: { page, limit, total: sorted.length, totalPages: Math.ceil(sorted.length / limit) },
  };
}
