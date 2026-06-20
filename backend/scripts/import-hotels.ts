import * as fs from "fs";
import * as path from "path";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { AMENITY_DEFINITIONS } from "../src/data/hotelGenerator";

const prisma = new PrismaClient();

const hotelSchema = z.object({
  name: z.string(),
  city: z.string(),
  country: z.string(),
  description: z.string(),
  stars: z.number().int().min(1).max(5),
  rating: z.number().min(0).max(10),
  pricePerNight: z.number().min(0),
  imageUrl: z.string().url(),
  latitude: z.number(),
  longitude: z.number(),
  affiliateUrl: z.string().url(),
  popularityScore: z.number().int().min(0).max(100),
  amenitySlugs: z.array(z.string()),
});

const hotelsArraySchema = z.array(hotelSchema);

async function ensureAmenities() {
  for (const def of AMENITY_DEFINITIONS) {
    await prisma.amenity.upsert({
      where: { slug: def.slug },
      create: { name: def.name, slug: def.slug },
      update: { name: def.name },
    });
  }
  return prisma.amenity.findMany();
}

async function importHotels(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  let raw: unknown;

  if (ext === ".json") {
    raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } else if (ext === ".csv") {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    raw = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = values[i] ?? "";
      });
      return {
        name: row.name,
        city: row.city,
        country: row.country,
        description: row.description,
        stars: Number(row.stars),
        rating: Number(row.rating),
        pricePerNight: Number(row.pricePerNight),
        imageUrl: row.imageUrl,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        affiliateUrl: row.affiliateUrl,
        popularityScore: Number(row.popularityScore),
        amenitySlugs: row.amenitySlugs.split("|"),
      };
    });
  } else {
    throw new Error("Unsupported file format. Use .json or .csv");
  }

  const hotels = hotelsArraySchema.parse(raw);
  const amenities = await ensureAmenities();
  const amenityBySlug = new Map(amenities.map((a) => [a.slug, a]));

  let imported = 0;
  for (const hotel of hotels) {
    const created = await prisma.hotel.create({
      data: {
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
      },
    });

    for (const slug of hotel.amenitySlugs) {
      const amenity = amenityBySlug.get(slug);
      if (amenity) {
        await prisma.hotelAmenity.create({
          data: { hotelId: created.id, amenityId: amenity.id },
        });
      }
    }
    imported++;
  }

  console.log(`Imported ${imported} hotels from ${filePath}`);
}

const fileArg = process.argv[2];
if (!fileArg) {
  console.error("Usage: npm run import:hotels -- <path-to-json-or-csv>");
  process.exit(1);
}

importHotels(path.resolve(fileArg))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
