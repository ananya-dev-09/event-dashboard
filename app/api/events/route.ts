import { Types } from "mongoose";
import { ROLES } from "@/lib/auth/roles";
import { requireRoles } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongoose";
import { createEventSchema } from "@/lib/validators/event";
import { EventModel } from "@/models/Event";
import { fail, ok } from "@/lib/utils/route";

export async function GET() {
  await connectToDatabase();
  const events = await EventModel.find().sort({ startAt: 1 }).lean();
  return ok(events);
}

export async function POST(request: Request) {
  const auth = await requireRoles([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]);
  if (auth.error) return auth.error;

  const payload = createEventSchema.safeParse(await request.json());
  if (!payload.success) return fail(payload.error.issues[0]?.message || "Invalid payload", 422);

  await connectToDatabase();
  const event = await EventModel.create({
    ...payload.data,
    organizationId: new Types.ObjectId(payload.data.organizationId),
    createdByUserId: new Types.ObjectId(auth.session?.user.id),
  });

  return ok(event, 201);
}
