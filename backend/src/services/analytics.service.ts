import { prisma } from "../lib/prisma";

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export async function getAnalyticsSummary() {
  const now = new Date();
  const sevenDaysAgo = daysAgo(7);
  const thirtyDaysAgo = daysAgo(30);

  const [
    clicksAllTime,
    clicks7d,
    clicks30d,
    searchesAllTime,
    searches7d,
    recommendationsAllTime,
    recommendations7d,
    topHotels,
    clicksByDay,
  ] = await Promise.all([
    prisma.affiliateClick.count(),
    prisma.affiliateClick.count({ where: { clickedAt: { gte: sevenDaysAgo } } }),
    prisma.affiliateClick.count({ where: { clickedAt: { gte: thirtyDaysAgo } } }),
    prisma.searchEvent.count(),
    prisma.searchEvent.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.recommendationEvent.count(),
    prisma.recommendationEvent.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.affiliateClick.groupBy({
      by: ["hotelId"],
      _count: { hotelId: true },
      orderBy: { _count: { hotelId: "desc" } },
      take: 10,
    }),
    prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT "clickedAt"::date as date, COUNT(*)::int as count
      FROM "AffiliateClick"
      WHERE "clickedAt" >= ${thirtyDaysAgo}
      GROUP BY "clickedAt"::date
      ORDER BY date ASC
    `,
  ]);

  const hotelIds = topHotels.map((h) => h.hotelId);
  const hotels = await prisma.hotel.findMany({
    where: { id: { in: hotelIds } },
    select: { id: true, name: true, city: true },
  });
  const hotelMap = new Map(hotels.map((h) => [h.id, h]));

  return {
    generatedAt: now.toISOString(),
    affiliateClicks: {
      allTime: clicksAllTime,
      last7Days: clicks7d,
      last30Days: clicks30d,
    },
    searches: {
      allTime: searchesAllTime,
      last7Days: searches7d,
    },
    recommendations: {
      allTime: recommendationsAllTime,
      last7Days: recommendations7d,
    },
    topHotelsByClicks: topHotels.map((h) => ({
      hotelId: h.hotelId,
      clicks: h._count.hotelId,
      name: hotelMap.get(h.hotelId)?.name ?? "Unknown",
      city: hotelMap.get(h.hotelId)?.city ?? "",
    })),
    clicksPerDay: clicksByDay.map((row) => ({
      date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date),
      count: Number(row.count),
    })),
  };
}
