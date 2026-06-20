import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { getHotelById, listHotels, logSearchEvent } from "../services/hotel.service";
import { getRecommendations } from "../services/recommendations.service";
import { recordAffiliateClick, getRecentClicks } from "../services/affiliate.service";
import { getAnalyticsSummary } from "../services/analytics.service";
import {
  HotelsQuery,
  RecommendationsQuery,
  hotelsQuerySchema,
  affiliateClickSchema,
  analyticsClicksQuerySchema,
} from "../validators/schemas";

export async function healthCheck(_req: Request, res: Response) {
  let dbStatus = "connected";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "disconnected";
  }

  res.json({
    status: dbStatus === "connected" ? "ok" : "degraded",
    db: dbStatus,
    timestamp: new Date().toISOString(),
  });
}

export async function getHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as HotelsQuery;
    const result = await listHotels(query);

    await logSearchEvent({
      sessionId: query.sessionId,
      destination: query.destination,
      budget: query.budget,
      purpose: query.purpose,
      filters: hotelsQuerySchema.parse(req.query),
      resultCount: result.pagination.total,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getHotel(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const hotel = await getHotelById(id);
    res.json(hotel);
  } catch (error) {
    next(error);
  }
}

export async function getRecommendationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as RecommendationsQuery;
    const result = await getRecommendations(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function postAffiliateClick(req: Request, res: Response, next: NextFunction) {
  try {
    const body = affiliateClickSchema.parse(req.body);
    const click = await recordAffiliateClick(body);
    res.status(201).json({
      id: click.id,
      hotelId: click.hotelId,
      sessionId: click.sessionId,
      source: click.source,
      clickedAt: click.clickedAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAnalyticsSummaryHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const summary = await getAnalyticsSummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
}

export async function getAnalyticsClicks(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = analyticsClicksQuerySchema.parse(req.query);
    const result = await getRecentClicks(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function listAmenities(_req: Request, res: Response, next: NextFunction) {
  try {
    const amenities = await prisma.amenity.findMany({ orderBy: { name: "asc" } });
    res.json(amenities);
  } catch (error) {
    next(error);
  }
}
