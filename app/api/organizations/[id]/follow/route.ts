import { Types } from "mongoose";
import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";
import { OrganizationModel } from "@/models/Organization";
import { fail, ok } from "@/lib/utils/route";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);
  const { id } = await params;
  await connectToDatabase();

  await UserModel.findByIdAndUpdate(session.user.id, { $addToSet: { followingOrganizationIds: new Types.ObjectId(id) } });
  await OrganizationModel.findByIdAndUpdate(id, { $inc: { followerCount: 1 } });
  return ok({ followed: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);
  const { id } = await params;
  await connectToDatabase();

  await UserModel.findByIdAndUpdate(session.user.id, { $pull: { followingOrganizationIds: new Types.ObjectId(id) } });
  await OrganizationModel.findByIdAndUpdate(id, { $inc: { followerCount: -1 } });
  return ok({ followed: false });
}
