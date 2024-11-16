import { UserRole } from "@prisma/client";

export type AuthUserType = {
  email: string;
  role: UserRole;
} | null;
