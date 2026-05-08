import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { updateMeSchema } from "@/lib/validators/user";
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

  const payload = updateMeSchema.safeParse(await request.json());
  if (!payload.success) return fail(payload.error.issues[0]?.message || "Invalid payload", 422);

  await connectToDatabase();
  const user = await UserModel.findByIdAndUpdate(
    session.user.id,
    { $set: payload.data },
    { new: true }
  )
    .select("-passwordHash")
    .lean();

  return ok(user);
}
