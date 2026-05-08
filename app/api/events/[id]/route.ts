import { ROLES } from "@/lib/auth/roles";
import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { updateEventSchema } from "@/lib/validators/event";
import { EventModel } from "@/models/Event";
import { fail, ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const event = await EventModel.findById(id).lean();
  if (!event) return fail("Event not found", 404);
  return ok(event);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  const payload = updateEventSchema.safeParse(await request.json());
  if (!payload.success) return fail(payload.error.issues[0]?.message || "Invalid payload", 422);

  await connectToDatabase();
  const event = await EventModel.findById(id).lean();
  if (!event) return fail("Event not found", 404);

  const isOwner = String(event.createdByUserId) === session.user.id;
  const isAdmin = session.user.role === ROLES.SUPER_ADMIN || session.user.role === ROLES.ORG_ADMIN;
  if (!isOwner && !isAdmin) return fail("Forbidden", 403);

  const updated = await EventModel.findByIdAndUpdate(id, { $set: payload.data }, { new: true }).lean();
  if (!updated) return fail("Event not found", 404);
  return ok(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  await connectToDatabase();
  const event = await EventModel.findById(id).lean();
  if (!event) return fail("Event not found", 404);

  const isOwner = String(event.createdByUserId) === session.user.id;
  const isAdmin = session.user.role === ROLES.SUPER_ADMIN || session.user.role === ROLES.ORG_ADMIN;
  if (!isOwner && !isAdmin) return fail("Forbidden", 403);

  const deleted = await EventModel.findByIdAndDelete(id).lean();
  if (!deleted) return fail("Event not found", 404);
  return ok({ deleted: true });
}
