export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORG_ADMIN: "ORG_ADMIN",
  INDIVIDUAL: "INDIVIDUAL",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
