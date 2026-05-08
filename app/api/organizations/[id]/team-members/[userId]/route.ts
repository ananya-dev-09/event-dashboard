import { Types } from "mongoose";
import { ROLES } from "@/lib/auth/roles";
import { requireRoles } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongoose";
import { OrganizationModel } from "@/models/Organization";
import { UserModel } from "@/models/User";
import { ok } from "@/lib/utils/route";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  const auth = await requireRoles([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]);
  if (auth.error) return auth.error;

  const { id, userId } = await params;
  await connectToDatabase();

  await OrganizationModel.findByIdAndUpdate(id, { $pull: { teamMemberUserIds: new Types.ObjectId(userId) } });
  await UserModel.findByIdAndUpdate(userId, { $pull: { organizationIds: new Types.ObjectId(id) } });

  return ok({ removed: true });
}
