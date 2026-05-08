import { connectToDatabase } from "@/lib/db/mongoose";
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
  const { id } = await params;
  const updates = await request.json();
  await connectToDatabase();
  const quiz = await QuizModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
  if (!quiz) return fail("Quiz not found", 404);
  return ok(quiz);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const quiz = await QuizModel.findByIdAndDelete(id).lean();
  if (!quiz) return fail("Quiz not found", 404);
  return ok({ deleted: true });
}
