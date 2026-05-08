import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";
import { fail, ok } from "@/lib/utils/route";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  await connectToDatabase();
  const user = await UserModel.findById(session.user.id).select("-passwordHash").lean();
  if (!user) return fail("User not found", 404);

  return ok(user);
}

export async function PATCH(request: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const body = await request.json();
  await connectToDatabase();
  const user = await UserModel.findByIdAndUpdate(
    session.user.id,
    { $set: { name: body.name, bio: body.bio, avatarUrl: body.avatarUrl } },
    { new: true }
  )
    .select("-passwordHash")
    .lean();

  return ok(user);
}
