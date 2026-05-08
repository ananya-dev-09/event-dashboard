import { z } from "zod";

const dateTimeToDateSchema = z.string().datetime().transform((value) => new Date(value));

const eventBaseSchema = z.object({
  organizationId: z.string(),
  title: z.string().min(3),
  slug: z.string().min(2),
  description: z.string().min(3),
  mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
  venue: z.string().optional(),
  meetingLink: z.string().url().optional(),
  startAt: dateTimeToDateSchema,
  endAt: dateTimeToDateSchema,
  registrationDeadline: dateTimeToDateSchema.optional(),
  capacity: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
});

export const createEventSchema = eventBaseSchema
  .refine((value) => value.endAt > value.startAt, {
    message: "endAt must be after startAt",
    path: ["endAt"],
  });

export const updateEventSchema = eventBaseSchema
  .omit({ organizationId: true })
  .partial()
  .refine((value) => !value.startAt || !value.endAt || value.endAt > value.startAt, {
    message: "endAt must be after startAt",
    path: ["endAt"],
  });
