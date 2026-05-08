import { connectToDatabase } from "@/lib/db/mongoose";
import { PostModel } from "@/models/Post";
import { fail, ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const post = await PostModel.findById(id).lean();
  if (!post) return fail("Post not found", 404);
  return ok(post);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  await connectToDatabase();
  const post = await PostModel.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
  if (!post) return fail("Post not found", 404);
  return ok(post);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const deleted = await PostModel.findByIdAndDelete(id).lean();
  if (!deleted) return fail("Post not found", 404);
  return ok({ deleted: true });
}
