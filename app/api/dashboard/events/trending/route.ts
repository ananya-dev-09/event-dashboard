import { connectToDatabase } from "@/lib/db/mongoose";
import { EventModel } from "@/models/Event";
import { ok } from "@/lib/utils/route";

export async function GET() {
  await connectToDatabase();
  const trending = await EventModel.find({ status: "PUBLISHED" })
    .sort({ attendeeCount: -1, startAt: 1 })
    .limit(10)
    .lean();

  return ok(trending);
}
