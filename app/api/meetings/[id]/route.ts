import { connectToDatabase } from "@/lib/db/mongoose";
import { MeetingRoomModel } from "@/models/MeetingRoom";
import { fail, ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const room = await MeetingRoomModel.findById(id).lean();
  if (!room) return fail("Meeting not found", 404);
  return ok(room);
}
