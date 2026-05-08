import QRCode from "qrcode";
import { randomUUID } from "crypto";
import { Types } from "mongoose";
import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { EventRegistrationModel } from "@/models/EventRegistration";
import { EventModel } from "@/models/Event";
import { UserModel } from "@/models/User";
import { fail, ok } from "@/lib/utils/route";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  await connectToDatabase();

  const event = await EventModel.findById(id).lean();
  if (!event) return fail("Event not found", 404);

  const ticketId = randomUUID();
  const qrCodeData = await QRCode.toDataURL(JSON.stringify({ ticketId, eventId: id, userId: session.user.id }));

  const registration = await EventRegistrationModel.create({
    userId: new Types.ObjectId(session.user.id),
    eventId: new Types.ObjectId(id),
    ticketId,
    qrCodeData,
  });

  await EventModel.findByIdAndUpdate(id, { $inc: { attendeeCount: 1 } });
  await UserModel.findByIdAndUpdate(session.user.id, { $addToSet: { registeredEventIds: new Types.ObjectId(id) } });

  return ok(registration, 201);
}
