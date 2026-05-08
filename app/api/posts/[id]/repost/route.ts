import { Types } from "mongoose";
import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";
import { PostModel } from "@/models/Post";
import { fail, ok } from "@/lib/utils/route";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  await connectToDatabase();
  await UserModel.findByIdAndUpdate(session.user.id, { $addToSet: { repostedPostIds: new Types.ObjectId(id) } });
  await PostModel.findByIdAndUpdate(id, { $inc: { repostCount: 1 } });

  return ok({ reposted: true });
}
