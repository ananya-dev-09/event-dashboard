import { z } from "zod";

const questionSchema = z.object({
  type: z.enum(["MCQ", "CODING"]),
  prompt: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  marks: z.number().min(0),
  negativeMarks: z.number().min(0).optional(),
  codingMeta: z.object({
    language: z.string(),
    starterCode: z.string().optional(),
    testCases: z.array(z.object({ input: z.string(), output: z.string() })).optional(),
  }).optional(),
});

export const createQuizSchema = z.object({
  organizationId: z.string(),
  eventId: z.string().optional(),
  title: z.string().min(3),
  description: z.string().min(3),
  instructions: z.string().optional(),
  durationSeconds: z.number().int().positive(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  questions: z.array(questionSchema).min(1),
});
