# StayFinder — Hotel Recommendation Platform MVP

A lightweight hotel recommendation system that helps users discover hotels and redirects them through affiliate booking links.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, React Query, React Router, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Zod
- **Database:** PostgreSQL with Prisma ORM

## Project Structure

```
test/
├── backend/          # Express API
├── frontend/         # React web app
├── docker-compose.yml
├── .env.example
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp ../.env.example .env
# Edit .env if needed — DATABASE_URL should match docker-compose

npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

API runs at `http://localhost:3001`.

### 3. Frontend

```bash
cd frontend
echo 'VITE_API_URL=' > .env
npm install
npm run dev
```

App runs at `http://localhost:5173`. The Vite dev server proxies `/api` to the backend.

### Verify

```bash
curl http://localhost:3001/api/health
curl "http://localhost:3001/api/hotels?destination=Cairo"
curl "http://localhost:3001/api/recommendations?destination=Cairo&budget=150&purpose=business"
```

## Seed Data

The seed script creates **120 hotels** across Cairo, Dubai, London, Paris, Istanbul, and Riyadh with 15 amenities.

```bash
cd backend
npx prisma db seed
```

### Import from JSON or CSV

```bash
npm run import:hotels -- data/hotels.json
npm run import:hotels -- data/hotels.csv
```

CSV columns: `name,city,country,description,stars,rating,pricePerNight,imageUrl,latitude,longitude,affiliateUrl,popularityScore,amenitySlugs` (amenities pipe-separated).

## Testing

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Manual Test Checklist

- [ ] Home page: search by destination, budget, purpose
- [ ] Search results: filter by price, stars, rating, amenities
- [ ] Sort by recommended, lowest price, highest rating
- [ ] Recommendations page shows match score and reasons
- [ ] Hotel details: gallery, amenities, Book Now redirect
- [ ] Affiliate click tracked in `AffiliateClick` table
- [ ] Analytics summary returns counts

## Deployment

### Frontend — Vercel

1. Import repo, set root directory to `frontend`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable: `VITE_API_URL=https://your-api.railway.app`

### Backend — Railway

1. Create new project from repo, root directory `backend`
2. Add PostgreSQL plugin (sets `DATABASE_URL`)
3. Set environment variables:
   - `FRONTEND_URL=https://your-app.vercel.app`
   - `NODE_ENV=production`
4. Build: `npm run build`
5. Start: `npm run start` (runs migrations then starts server)
6. Run seed once: `npx prisma db seed`

### Backend — Render (alternative)

1. New Web Service, root `backend`
2. Build: `npm install && npm run build`
3. Start: `npm run start`
4. Attach Render PostgreSQL and set `DATABASE_URL`, `FRONTEND_URL`

### Docker (backend only)

```bash
cd backend
docker build -t hotel-api .
docker run -p 3001:3001 -e DATABASE_URL=... -e FRONTEND_URL=... hotel-api
```

## API Documentation

See [backend/docs/API.md](backend/docs/API.md) for full endpoint reference.

## Environment Variables

| Variable | App | Description |
|----------|-----|-------------|
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `PORT` | Backend | API port (default 3001) |
| `FRONTEND_URL` | Backend | CORS allowed origin |
| `NODE_ENV` | Backend | `development` or `production` |
| `VITE_API_URL` | Frontend | API base URL (empty uses Vite proxy in dev) |

## Recommendation Scoring

Deterministic weighted scoring (no ML):

```
score = (Price×30) + (Stars×20) + (Amenities×25) + (Rating×15) + (Popularity×10)
```

Travel purpose adjusts amenity weights and price tolerance. See `backend/src/services/recommendation.service.ts`.

## License

MIT
