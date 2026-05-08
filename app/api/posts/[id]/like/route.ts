import { Types } from "mongoose";
import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { PostModel } from "@/models/Post";
import { fail, ok } from "@/lib/utils/route";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  await connectToDatabase();
  await PostModel.findByIdAndUpdate(id, { $addToSet: { likeUserIds: new Types.ObjectId(session.user.id) } });
  return ok({ liked: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  await connectToDatabase();
  await PostModel.findByIdAndUpdate(id, { $pull: { likeUserIds: new Types.ObjectId(session.user.id) } });
  return ok({ liked: false });
}
