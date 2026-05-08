import { connectToDatabase } from "@/lib/db/mongoose";
import { QuizAttemptModel } from "@/models/QuizAttempt";
import { ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const leaderboard = await QuizAttemptModel.find({ quizId: id, submittedAt: { $exists: true } })
    .sort({ score: -1, submittedAt: 1 })
    .limit(50)
    .select("userId score submittedAt")
    .lean();

  return ok(leaderboard);
}
