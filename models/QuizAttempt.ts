import { model, models, Schema } from "mongoose";

const quizAttemptSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: [{ type: String }],
    score: { type: Number, default: 0 },
    startedAt: { type: Date, required: true },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export const QuizAttemptModel = models.QuizAttempt || model("QuizAttempt", quizAttemptSchema);
