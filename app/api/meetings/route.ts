import { Types } from "mongoose";
import { ROLES } from "@/lib/auth/roles";
import { requireRoles } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongoose";
import { buildJitsiRoomUrl } from "@/lib/services/meetings";
import { MeetingRoomModel } from "@/models/MeetingRoom";
import { fail, ok } from "@/lib/utils/route";

export async function POST(request: Request) {
  const auth = await requireRoles([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]);
  if (auth.error) return auth.error;

  const { organizationId, eventId, provider = "JITSI", roomName } = await request.json();
  if (!organizationId || !roomName) return fail("organizationId and roomName are required", 422);

  await connectToDatabase();
  const room = await MeetingRoomModel.create({
    organizationId: new Types.ObjectId(organizationId),
    eventId: eventId ? new Types.ObjectId(eventId) : undefined,
    provider,
    roomUrl: buildJitsiRoomUrl(roomName),
    hostUserId: new Types.ObjectId(auth.session?.user.id),
  });

  return ok(room, 201);
}
