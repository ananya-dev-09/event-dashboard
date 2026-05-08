import { z } from "zod";

export const createPostSchema = z.object({
  organizationId: z.string(),
  contentText: z.string().min(1),
  visibility: z.enum(["PUBLIC", "FOLLOWERS"]).default("PUBLIC"),
  media: z.array(z.object({
    type: z.enum(["IMAGE", "VIDEO"]),
    url: z.string().url(),
    publicId: z.string(),
    thumbnailUrl: z.string().url().optional(),
    duration: z.number().optional(),
  })).default([]),
  hashtags: z.array(z.string()).default([]),
});
