import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    let db;
    try {
      db = await getDb();
    } catch (dbErr) {
      // Return empty list gracefully if DB is offline
      return NextResponse.json({ scans: [], dbOffline: true });
    }

    const scans = await db
      .collection("scans")
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    // Map _id to string for JSON serialization
    const serializedScans = scans.map((scan: any) => ({
      ...scan,
      _id: scan._id.toString(),
      final_score: scan.final_score !== undefined ? scan.final_score : scan.finalScore,
      finalScore: scan.finalScore !== undefined ? scan.finalScore : scan.final_score,
    }));

    return NextResponse.json({ scans: serializedScans, dbOffline: false });
  } catch (error: any) {
    console.error("Fetch scan history error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
