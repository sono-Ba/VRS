import type { Permission, UserRole } from "@/auth/permissions";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  organizationId?: string;
  teamId?: string;
  permissions: Permission[];
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}
