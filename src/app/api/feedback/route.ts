import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const { scanId, userVerdict, comments } = await request.json();

    if (!scanId) {
      return NextResponse.json({ error: "Missing scanId parameter" }, { status: 400 });
    }

    const db = await getDb();

    // 1. Log feedback in a separate collection
    const feedbackDoc = {
      scanId,
      userVerdict,
      comments: comments || "",
      timestamp: new Date(),
    };
    await db.collection("feedback").insertOne(feedbackDoc);

    // 2. Update the original scan log entry with user feedback details if possible
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(scanId);
      const queryId = isObjectId ? new ObjectId(scanId) : scanId;
      await db.collection("scans").updateOne(
        { _id: queryId },
        {
          $set: {
            reported: true,
            reportedVerdict: userVerdict,
            reportedComments: comments || "",
          },
        }
      );
    } catch (e) {
      console.warn("Could not update original scan document with reported status.");
    }

    return NextResponse.json({ success: true, message: "Feedback submitted successfully." });
  } catch (error: any) {
    console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
