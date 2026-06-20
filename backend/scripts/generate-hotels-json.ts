import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { generateHotels } from "../src/data/hotelGenerator";

const hotels = generateHotels(20);
const dir = join(__dirname, "..", "data");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "hotels.json"), JSON.stringify(hotels, null, 2));
console.log(`Wrote ${hotels.length} hotels to data/hotels.json`);
