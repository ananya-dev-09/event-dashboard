import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentCommentId: z.string().optional(),
});
