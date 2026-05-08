import { connectToDatabase } from "@/lib/db/mongoose";
import { EventModel } from "@/models/Event";
import { fail, ok } from "@/lib/utils/route";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const event = await EventModel.findByIdAndUpdate(id, { $set: { status: "PUBLISHED" } }, { new: true }).lean();
  if (!event) return fail("Event not found", 404);
  return ok(event);
}
