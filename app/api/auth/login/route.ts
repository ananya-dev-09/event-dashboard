import { loginSchema } from "@/lib/validators/auth";
import { fail, ok } from "@/lib/utils/route";

export async function POST(request: Request) {
  const payload = loginSchema.safeParse(await request.json());
  if (!payload.success) return fail(payload.error.issues[0]?.message || "Invalid payload", 422);

  return ok({ message: "Use /api/auth/[...nextauth] credentials sign-in endpoint for session login" });
}
