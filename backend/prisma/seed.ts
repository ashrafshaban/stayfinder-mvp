import { PrismaClient } from "@prisma/client";
import { AMENITY_DEFINITIONS, generateHotels } from "../src/data/hotelGenerator";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.hotelAmenity.deleteMany();
  await prisma.affiliateClick.deleteMany();
  await prisma.searchEvent.deleteMany();
  await prisma.recommendationEvent.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.amenity.deleteMany();

  const amenities = await Promise.all(
    AMENITY_DEFINITIONS.map((a) =>
      prisma.amenity.create({ data: { name: a.name, slug: a.slug } })
    )
  );

  const amenityBySlug = new Map(amenities.map((a) => [a.slug, a]));

  const dataPath = path.join(__dirname, "..", "data", "hotels.json");
  let hotelsData;

  if (fs.existsSync(dataPath)) {
    hotelsData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  } else {
    hotelsData = generateHotels(20);
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(hotelsData, null, 2));
    console.log(`Generated ${hotelsData.length} hotels to ${dataPath}`);
  }

  for (const hotel of hotelsData) {
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
  }

  console.log(`Seeded ${hotelsData.length} hotels and ${amenities.length} amenities.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
