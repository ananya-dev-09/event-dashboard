import { z } from "zod";
import { ROLES } from "@/lib/auth/roles";

export const registerSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.INDIVIDUAL]).default(ROLES.INDIVIDUAL),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
