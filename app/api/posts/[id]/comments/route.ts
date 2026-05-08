import { Types } from "mongoose";
import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { CommentModel } from "@/models/Comment";
import { PostModel } from "@/models/Post";
import { fail, ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const comments = await CommentModel.find({ postId: id }).sort({ createdAt: -1 }).lean();
  return ok(comments);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  const { content, parentCommentId } = await request.json();
  if (!content) return fail("content is required", 422);

  await connectToDatabase();
  const comment = await CommentModel.create({
    postId: new Types.ObjectId(id),
    userId: new Types.ObjectId(session.user.id),
    content,
    parentCommentId: parentCommentId ? new Types.ObjectId(parentCommentId) : undefined,
  });
  await PostModel.findByIdAndUpdate(id, { $inc: { commentCount: 1 } });

  return ok(comment, 201);
}
