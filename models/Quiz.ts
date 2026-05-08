import { model, models, Schema, type InferSchemaType } from "mongoose";

const quizQuestionSchema = new Schema(
  {
    type: { type: String, enum: ["MCQ", "CODING"], required: true },
    prompt: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String },
    marks: { type: Number, required: true },
    negativeMarks: { type: Number, default: 0 },
    codingMeta: {
      language: { type: String },
      starterCode: { type: String },
      testCases: [{ input: String, output: String }],
    },
  },
  { _id: false }
);

const quizSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructions: { type: String },
    durationSeconds: { type: Number, required: true },
    startAt: { type: Date },
    endAt: { type: Date },
    status: { type: String, enum: ["DRAFT", "PUBLISHED", "ONGOING", "COMPLETED"], default: "DRAFT" },
    questions: [quizQuestionSchema],
    totalMarks: { type: Number, default: 0 },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export type Quiz = InferSchemaType<typeof quizSchema>;
export const QuizModel = models.Quiz || model("Quiz", quizSchema);
