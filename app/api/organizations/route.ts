import { Types } from "mongoose";
import { ROLES } from "@/lib/auth/roles";
import { requireRoles } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongoose";
import { createOrganizationSchema } from "@/lib/validators/organization";
import { OrganizationModel } from "@/models/Organization";
import { fail, ok } from "@/lib/utils/route";

export async function GET() {
  await connectToDatabase();
  const organizations = await OrganizationModel.find().sort({ createdAt: -1 }).lean();
  return ok(organizations);
}

export async function POST(request: Request) {
  const auth = await requireRoles([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]);
  if (auth.error) return auth.error;

  const payload = createOrganizationSchema.safeParse(await request.json());
  if (!payload.success) return fail(payload.error.issues[0]?.message || "Invalid payload", 422);

  await connectToDatabase();
  const created = await OrganizationModel.create({
    ...payload.data,
    ownerUserId: new Types.ObjectId(auth.session?.user.id),
  });

  return ok(created, 201);
}
