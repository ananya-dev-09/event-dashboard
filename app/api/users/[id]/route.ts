import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";
import { fail, ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const user = await UserModel.findById(id).select("name username avatarUrl bio role").lean();
  if (!user) return fail("User not found", 404);
  return ok(user);
}
