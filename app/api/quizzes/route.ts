import { Types } from "mongoose";
import { ROLES } from "@/lib/auth/roles";
import { requireRoles } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongoose";
import { createQuizSchema } from "@/lib/validators/quiz";
import { QuizModel } from "@/models/Quiz";
import { fail, ok } from "@/lib/utils/route";

export async function GET() {
  await connectToDatabase();
  const quizzes = await QuizModel.find().sort({ createdAt: -1 }).lean();
  return ok(quizzes);
}

export async function POST(request: Request) {
  const auth = await requireRoles([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]);
  if (auth.error) return auth.error;

  const payload = createQuizSchema.safeParse(await request.json());
  if (!payload.success) return fail(payload.error.issues[0]?.message || "Invalid payload", 422);

  const totalMarks = payload.data.questions.reduce((sum, q) => sum + q.marks, 0);

  await connectToDatabase();
  const quiz = await QuizModel.create({
    ...payload.data,
    organizationId: new Types.ObjectId(payload.data.organizationId),
    eventId: payload.data.eventId ? new Types.ObjectId(payload.data.eventId) : undefined,
    totalMarks,
    createdByUserId: new Types.ObjectId(auth.session?.user.id),
  });

  return ok(quiz, 201);
}
