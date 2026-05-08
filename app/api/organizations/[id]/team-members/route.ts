import { Types } from "mongoose";
import { ROLES } from "@/lib/auth/roles";
import { requireRoles } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongoose";
import { OrganizationModel } from "@/models/Organization";
import { UserModel } from "@/models/User";
import { fail, ok } from "@/lib/utils/route";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]);
  if (auth.error) return auth.error;

  const { id } = await params;
  const { userId } = await request.json();
  if (!userId) return fail("userId is required", 422);

  await connectToDatabase();
  await OrganizationModel.findByIdAndUpdate(id, { $addToSet: { teamMemberUserIds: new Types.ObjectId(userId) } });
  await UserModel.findByIdAndUpdate(userId, { $addToSet: { organizationIds: new Types.ObjectId(id) } });

  return ok({ added: true });
}
