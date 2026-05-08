import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { QuizAttemptModel } from "@/models/QuizAttempt";
import { fail, ok } from "@/lib/utils/route";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  await connectToDatabase();
  const attempt = await QuizAttemptModel.create({
    quizId: id,
    userId: session.user.id,
    startedAt: new Date(),
    answers: [],
  });

  return ok(attempt, 201);
}
