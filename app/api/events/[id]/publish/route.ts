import { ROLES } from "@/lib/auth/roles";
import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { EventModel } from "@/models/Event";
import { fail, ok } from "@/lib/utils/route";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  await connectToDatabase();
  const existing = await EventModel.findById(id).lean();
  if (!existing) return fail("Event not found", 404);

  const isOwner = String(existing.createdByUserId) === session.user.id;
  const isAdmin = session.user.role === ROLES.SUPER_ADMIN || session.user.role === ROLES.ORG_ADMIN;
  if (!isOwner && !isAdmin) return fail("Forbidden", 403);

  const event = await EventModel.findByIdAndUpdate(
    id,
    { $set: { status: "PUBLISHED" } },
    { new: true }
  ).lean();
  if (!event) return fail("Event not found", 404);
  return ok(event);
}
