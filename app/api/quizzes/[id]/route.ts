import { ROLES } from "@/lib/auth/roles";
import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { updateQuizSchema } from "@/lib/validators/quiz";
import { QuizModel } from "@/models/Quiz";
import { fail, ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const quiz = await QuizModel.findById(id).lean();
  if (!quiz) return fail("Quiz not found", 404);
  return ok(quiz);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  const payload = updateQuizSchema.safeParse(await request.json());
  if (!payload.success) return fail(payload.error.issues[0]?.message || "Invalid payload", 422);

  await connectToDatabase();
  const quiz = await QuizModel.findById(id).lean();
  if (!quiz) return fail("Quiz not found", 404);

  const isOwner = String(quiz.createdByUserId) === session.user.id;
  const isAdmin = session.user.role === ROLES.SUPER_ADMIN || session.user.role === ROLES.ORG_ADMIN;
  if (!isOwner && !isAdmin) return fail("Forbidden", 403);

  const updated = await QuizModel.findByIdAndUpdate(id, { $set: payload.data }, { new: true }).lean();
  if (!updated) return fail("Quiz not found", 404);
  return ok(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  await connectToDatabase();
  const quiz = await QuizModel.findById(id).lean();
  if (!quiz) return fail("Quiz not found", 404);

  const isOwner = String(quiz.createdByUserId) === session.user.id;
  const isAdmin = session.user.role === ROLES.SUPER_ADMIN || session.user.role === ROLES.ORG_ADMIN;
  if (!isOwner && !isAdmin) return fail("Forbidden", 403);

  const deleted = await QuizModel.findByIdAndDelete(id).lean();
  if (!deleted) return fail("Quiz not found", 404);
  return ok({ deleted: true });
}
