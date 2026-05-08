import { Types } from "mongoose";
import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { createPostSchema } from "@/lib/validators/post";
import { PostModel } from "@/models/Post";
import { fail, ok } from "@/lib/utils/route";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const payload = createPostSchema.safeParse(await request.json());
  if (!payload.success) return fail(payload.error.issues[0]?.message || "Invalid payload", 422);

  await connectToDatabase();
  const post = await PostModel.create({
    ...payload.data,
    organizationId: new Types.ObjectId(payload.data.organizationId),
    authorUserId: new Types.ObjectId(session.user.id),
  });

  return ok(post, 201);
}

export async function GET() {
  await connectToDatabase();
  const posts = await PostModel.find().sort({ createdAt: -1 }).limit(30).lean();
  return ok(posts);
}
