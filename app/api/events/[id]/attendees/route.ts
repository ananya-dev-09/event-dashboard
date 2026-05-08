import { connectToDatabase } from "@/lib/db/mongoose";
import { EventRegistrationModel } from "@/models/EventRegistration";
import { ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const attendees = await EventRegistrationModel.find({ eventId: id }).lean();
  return ok(attendees);
}
