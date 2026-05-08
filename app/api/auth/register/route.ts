import { hash } from "bcryptjs";
import { registerSchema } from "@/lib/validators/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";
import { fail, ok } from "@/lib/utils/route";

export async function POST(request: Request) {
  const payload = registerSchema.safeParse(await request.json());
  if (!payload.success) return fail(payload.error.issues[0]?.message || "Invalid payload", 422);

  await connectToDatabase();
  const { email, username, password, ...rest } = payload.data;

  const exists = await UserModel.exists({ $or: [{ email: email.toLowerCase() }, { username }] });
  if (exists) return fail("User with email or username already exists", 409);

  const passwordHash = await hash(password, 14);
  const user = await UserModel.create({ ...rest, email: email.toLowerCase(), username, passwordHash });

  return ok({ id: String(user._id), email: user.email, role: user.role }, 201);
}
