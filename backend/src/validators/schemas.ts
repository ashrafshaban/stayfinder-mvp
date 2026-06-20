import { z } from "zod";

export const travelPurposeEnum = z.enum([
  "business",
  "family",
  "romantic",
  "luxury",
  "budget",
]);

export type TravelPurpose = z.infer<typeof travelPurposeEnum>;

export const sortEnum = z.enum(["recommended", "price_asc", "rating_desc"]);

export const hotelsQuerySchema = z.object({
  destination: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minStars: z.coerce.number().int().min(1).max(5).optional(),
  maxStars: z.coerce.number().int().min(1).max(5).optional(),
  minRating: z.coerce.number().min(0).max(10).optional(),
  amenities: z.string().optional(),
  sort: sortEnum.optional().default("recommended"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  budget: z.coerce.number().min(0).optional(),
  stars: z.coerce.number().int().min(1).max(5).optional(),
  purpose: travelPurposeEnum.optional(),
  sessionId: z.string().optional(),
});

export const recommendationsQuerySchema = z.object({
  destination: z.string().min(1),
  budget: z.coerce.number().min(0).optional(),
  stars: z.coerce.number().int().min(1).max(5).optional(),
  purpose: travelPurposeEnum.optional(),
  amenities: z.string().optional(),
  minRating: z.coerce.number().min(0).max(10).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  sessionId: z.string().optional(),
});

export const hotelIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const affiliateClickSchema = z.object({
  hotelId: z.string().uuid(),
  sessionId: z.string().min(1),
  source: z.string().optional().default("web"),
});

export const analyticsClicksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type HotelsQuery = z.infer<typeof hotelsQuerySchema>;
export type RecommendationsQuery = z.infer<typeof recommendationsQuerySchema>;
