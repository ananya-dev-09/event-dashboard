import { ROLES } from "@/lib/auth/roles";
import { requireRoles } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongoose";
import { OrganizationModel } from "@/models/Organization";
import { fail, ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const org = await OrganizationModel.findById(id).lean();
  if (!org) return fail("Organization not found", 404);
  return ok(org);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]);
  if (auth.error) return auth.error;

  const { id } = await params;
  const updates = await request.json();
  await connectToDatabase();

  const organization = await OrganizationModel.findById(id).lean();
  if (!organization) return fail("Organization not found", 404);

  const role = auth.session?.user.role;
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;
  const isOwner = String(organization.ownerUserId) === auth.session?.user.id;
  const isTeamMember = (organization.teamMemberUserIds ?? []).some(
    (memberId: unknown) => String(memberId) === auth.session?.user.id
  );
  if (!isSuperAdmin && !isOwner && !isTeamMember) return fail("Forbidden", 403);

  const updated = await OrganizationModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
  if (!updated) return fail("Organization not found", 404);
  return ok(updated);
}
