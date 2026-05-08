import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { scoreQuiz } from "@/lib/services/quiz-scoring";
import { QuizAttemptModel } from "@/models/QuizAttempt";
import { QuizModel } from "@/models/Quiz";
import { fail, ok } from "@/lib/utils/route";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  const { id } = await params;
  const { attemptId, answers } = await request.json();
  if (!attemptId || !Array.isArray(answers)) return fail("attemptId and answers are required", 422);

  await connectToDatabase();
  const quiz = await QuizModel.findById(id).lean();
  if (!quiz) return fail("Quiz not found", 404);

  const questions = (quiz.questions ?? []) as Array<{
    correctAnswer?: string;
    marks?: number;
    negativeMarks?: number;
  }>;
  const correctAnswers = questions.map((q) => q.correctAnswer ?? "");
  const marks = questions.map((q) => q.marks ?? 0);
  const negativeMarks = questions.map((q) => q.negativeMarks ?? 0);
  const score = scoreQuiz(answers, correctAnswers, marks, negativeMarks);

  const existingAttempt = await QuizAttemptModel.findById(attemptId).lean();
  if (!existingAttempt) return fail("Attempt not found", 404);
  if (String(existingAttempt.userId) !== session.user.id) return fail("Forbidden", 403);
  if (String(existingAttempt.quizId) !== id) return fail("Attempt does not match quiz", 422);

  const attempt = await QuizAttemptModel.findByIdAndUpdate(
    attemptId,
    { $set: { answers, score, submittedAt: new Date() } },
    { new: true }
  ).lean();

  return ok(attempt);
}
