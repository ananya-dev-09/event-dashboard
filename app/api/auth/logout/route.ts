import { ok } from "@/lib/utils/route";

export async function POST() {
  return ok({ message: "Use next-auth signOut on client to clear session" });
}
