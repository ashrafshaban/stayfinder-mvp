# Hotel Recommendation API

Base URL: `http://localhost:3001/api`

All responses are JSON. Validation errors return `400` with `{ error, details }`.

## Health

### `GET /api/health`

Check API and database connectivity.

**Response 200:**
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2026-06-20T12:00:00.000Z"
}
```

---

## Hotels

### `GET /api/hotels`

Search and filter hotels.

| Parameter | Type | Description |
|-----------|------|-------------|
| `destination` | string | Match city or country (case-insensitive) |
| `minPrice` | number | Minimum price per night |
| `maxPrice` | number | Maximum price per night |
| `minStars` | number | Minimum star rating (1-5) |
| `maxStars` | number | Maximum star rating (1-5) |
| `minRating` | number | Minimum guest rating (0-10) |
| `amenities` | string | Comma-separated amenity slugs |
| `sort` | string | `recommended`, `price_asc`, `rating_desc` |
| `budget` | number | Used for recommended scoring |
| `stars` | number | Preferred star rating for scoring |
| `purpose` | string | `business`, `family`, `romantic`, `luxury`, `budget` |
| `page` | number | Page number (default 1) |
| `limit` | number | Results per page (default 20, max 50) |
| `sessionId` | string | Guest session ID for analytics |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Grand Cairo Hotel",
      "city": "Cairo",
      "country": "Egypt",
      "stars": 4,
      "rating": 8.2,
      "pricePerNight": 120,
      "imageUrl": "https://...",
      "amenities": [{ "id": "...", "name": "WiFi", "slug": "wifi" }],
      "score": 89,
      "matchReasons": ["Matches your budget"]
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 20, "totalPages": 1 }
}
```

### `GET /api/hotels/:id`

Get a single hotel by UUID.

**Response 200:** Hotel object (same shape as list item, without score).

**Response 404:** `{ "error": "Hotel not found" }`

---

## Recommendations

### `GET /api/recommendations`

Get scored hotel recommendations.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `destination` | string | Yes | City or country |
| `budget` | number | No | Target nightly budget |
| `stars` | number | No | Preferred star rating |
| `purpose` | string | No | Travel purpose enum |
| `amenities` | string | No | Comma-separated slugs |
| `minRating` | number | No | Minimum guest rating |
| `page`, `limit`, `sessionId` | | No | Pagination and analytics |

**Response 200:** Same paginated shape as hotels, all items include `score` and `matchReasons`.

---

## Affiliate Tracking

### `POST /api/affiliate/click`

Record an affiliate link click.

**Body:**
```json
{
  "hotelId": "uuid",
  "sessionId": "guest-session-id",
  "source": "web"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "hotelId": "uuid",
  "sessionId": "...",
  "source": "web",
  "clickedAt": "2026-06-20T12:00:00.000Z"
}
```

---

## Analytics

### `GET /api/analytics/summary`

Dashboard-ready aggregate metrics.

**Response 200:**
```json
{
  "generatedAt": "...",
  "affiliateClicks": { "allTime": 0, "last7Days": 0, "last30Days": 0 },
  "searches": { "allTime": 0, "last7Days": 0 },
  "recommendations": { "allTime": 0, "last7Days": 0 },
  "topHotelsByClicks": [],
  "clicksPerDay": []
}
```

### `GET /api/analytics/clicks`

Recent affiliate clicks (paginated).

| Parameter | Type | Default |
|-----------|------|---------|
| `page` | number | 1 |
| `limit` | number | 20 |

---

## Amenities

### `GET /api/amenities`

List all available amenities for filter UI.

**Response 200:** `[{ "id": "...", "name": "WiFi", "slug": "wifi" }]`
