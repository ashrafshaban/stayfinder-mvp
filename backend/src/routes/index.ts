import { Router } from "express";
import {
  getHotels,
  getHotel,
  getRecommendationsHandler,
  postAffiliateClick,
  healthCheck,
  getAnalyticsSummaryHandler,
  getAnalyticsClicks,
  listAmenities,
} from "../controllers/handlers";
import { validateQuery, validateParams, validateBody } from "../middleware/validate";
import {
  hotelsQuerySchema,
  recommendationsQuerySchema,
  hotelIdParamSchema,
  affiliateClickSchema,
  analyticsClicksQuerySchema,
} from "../validators/schemas";

const router = Router();

router.get("/health", healthCheck);
router.get("/hotels", validateQuery(hotelsQuerySchema), getHotels);
router.get("/hotels/:id", validateParams(hotelIdParamSchema), getHotel);
router.get("/recommendations", validateQuery(recommendationsQuerySchema), getRecommendationsHandler);
router.post("/affiliate/click", validateBody(affiliateClickSchema), postAffiliateClick);
router.get("/analytics/summary", getAnalyticsSummaryHandler);
router.get("/analytics/clicks", validateQuery(analyticsClicksQuerySchema), getAnalyticsClicks);
router.get("/amenities", listAmenities);

export default router;
