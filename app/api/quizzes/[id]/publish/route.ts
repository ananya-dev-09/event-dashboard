import { connectToDatabase } from "@/lib/db/mongoose";
import { QuizModel } from "@/models/Quiz";
import { fail, ok } from "@/lib/utils/route";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const quiz = await QuizModel.findByIdAndUpdate(id, { $set: { status: "PUBLISHED" } }, { new: true }).lean();
  if (!quiz) return fail("Quiz not found", 404);
  return ok(quiz);
}
