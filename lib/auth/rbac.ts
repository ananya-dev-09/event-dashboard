import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import type { UserRole } from "@/lib/auth/roles";

export async function requireRoles(roles: UserRole[]) {
  const session = await getAuthSession();
  const role = session?.user?.role as UserRole | undefined;

  if (!session || !role) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (!roles.includes(role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { session };
}
