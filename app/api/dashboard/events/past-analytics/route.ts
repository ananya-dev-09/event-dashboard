import { connectToDatabase } from "@/lib/db/mongoose";
import { EventModel } from "@/models/Event";
import { ok } from "@/lib/utils/route";

export async function GET() {
  await connectToDatabase();
  const past = await EventModel.find({ endAt: { $lt: new Date() } })
    .select("title attendeeCount endAt")
    .sort({ endAt: -1 })
    .limit(20)
    .lean();

  return ok(past);
}
