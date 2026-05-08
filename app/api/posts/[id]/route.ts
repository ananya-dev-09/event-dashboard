import { z } from "zod";
import { ROLES } from "@/lib/auth/roles";
import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { PostModel } from "@/models/Post";
import { fail, ok } from "@/lib/utils/route";

const updatePostSchema = z.object({
  contentText: z.string().min(1).max(3000).optional(),
  visibility: z.enum(["PUBLIC", "FOLLOWERS"]).optional(),
  hashtags: z.array(z.string()).optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const post = await PostModel.findById(id).lean();
  if (!post) return fail("Post not found", 404);
  return ok(post);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  const payload = updatePostSchema.safeParse(await request.json());
  if (!payload.success) return fail(payload.error.issues[0]?.message || "Invalid payload", 422);

  await connectToDatabase();
  const post = await PostModel.findById(id).lean();
  if (!post) return fail("Post not found", 404);

  const isAuthor = String(post.authorUserId) === session.user.id;
  const isAdmin = session.user.role === ROLES.SUPER_ADMIN || session.user.role === ROLES.ORG_ADMIN;
  if (!isAuthor && !isAdmin) return fail("Forbidden", 403);

  const updated = await PostModel.findByIdAndUpdate(id, { $set: payload.data }, { new: true }).lean();
  if (!updated) return fail("Post not found", 404);
  return ok(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  await connectToDatabase();
  const post = await PostModel.findById(id).lean();
  if (!post) return fail("Post not found", 404);

  const isAuthor = String(post.authorUserId) === session.user.id;
  const isAdmin = session.user.role === ROLES.SUPER_ADMIN || session.user.role === ROLES.ORG_ADMIN;
  if (!isAuthor && !isAdmin) return fail("Forbidden", 403);

  const deleted = await PostModel.findByIdAndDelete(id).lean();
  if (!deleted) return fail("Post not found", 404);
  return ok({ deleted: true });
}
