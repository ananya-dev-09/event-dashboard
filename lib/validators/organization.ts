import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(3),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  category: z.string().optional(),
  website: z.string().url().optional(),
});
