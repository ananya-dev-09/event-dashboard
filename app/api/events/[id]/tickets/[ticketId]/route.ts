import { connectToDatabase } from "@/lib/db/mongoose";
import { EventRegistrationModel } from "@/models/EventRegistration";
import { fail, ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
  await connectToDatabase();
  const ticket = await EventRegistrationModel.findOne({ ticketId }).lean();
  if (!ticket) return fail("Ticket not found", 404);
  return ok(ticket);
}
