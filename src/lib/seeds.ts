import { Db } from "mongodb";
import { getDb } from "./db";
import { PROTECTED_BRANDS } from "./protectedBrands";
import { RISKY_TLDS } from "./riskyTlds";
import { URGENCY_KEYWORDS } from "./urgencyKeywords";

export async function seedDatabase() {
  try {
    const db: Db = await getDb();
    
    // 1. Seed Protected Brands
    const brandsCount = await db.collection("brands").countDocuments();
    if (brandsCount === 0) {
      console.log("Seeding protected brands...");
      await db.collection("brands").insertMany(PROTECTED_BRANDS);
    }

    // 2. Seed Risky TLDs
    const tldsCount = await db.collection("tlds").countDocuments();
    if (tldsCount === 0) {
      console.log("Seeding risky TLDs...");
      await db.collection("tlds").insertMany(RISKY_TLDS);
    }

    // 3. Seed Urgency Keywords
    const keywordsCount = await db.collection("keywords").countDocuments();
    if (keywordsCount === 0) {
      console.log("Seeding urgency keywords...");
      const docList = URGENCY_KEYWORDS.map(keyword => ({ keyword }));
      await db.collection("keywords").insertMany(docList);
    }
    
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}
