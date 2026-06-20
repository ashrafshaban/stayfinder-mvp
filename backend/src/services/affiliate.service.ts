import { prisma } from "../lib/prisma";

export async function recordAffiliateClick(data: {
  hotelId: string;
  sessionId: string;
  source: string;
}) {
  const hotel = await prisma.hotel.findUnique({ where: { id: data.hotelId } });
  if (!hotel) throw new Error("Hotel not found");

  return prisma.affiliateClick.create({
    data: {
      hotelId: data.hotelId,
      sessionId: data.sessionId,
      source: data.source,
    },
  });
}

export async function getRecentClicks(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [clicks, total] = await Promise.all([
    prisma.affiliateClick.findMany({
      skip,
      take: limit,
      orderBy: { clickedAt: "desc" },
      include: { hotel: { select: { id: true, name: true, city: true } } },
    }),
    prisma.affiliateClick.count(),
  ]);

  return {
    data: clicks.map((c) => ({
      id: c.id,
      hotelId: c.hotelId,
      hotelName: c.hotel.name,
      city: c.hotel.city,
      sessionId: c.sessionId,
      source: c.source,
      clickedAt: c.clickedAt,
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
