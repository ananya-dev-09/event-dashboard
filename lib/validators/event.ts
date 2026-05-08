import { z } from "zod";

export const createEventSchema = z.object({
  organizationId: z.string(),
  title: z.string().min(3),
  slug: z.string().min(2),
  description: z.string().min(3),
  mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
  venue: z.string().optional(),
  meetingLink: z.string().url().optional(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  registrationDeadline: z.coerce.date().optional(),
  capacity: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
});
