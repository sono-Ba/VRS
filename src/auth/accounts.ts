import type { User } from "@/domain";
import { permissionsForRole, type UserRole } from "./permissions";

/**
 * Demo accounts for the prototype.
 *
 * PROTOTYPE ONLY — this is not authentication. There are no credentials and no
 * server-side identity verification. Replace with a real identity provider and
 * server-validated sessions before any non-demo deployment.
 */
interface AccountSeed {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  teamId?: string;
}

const seeds: AccountSeed[] = [
  {
    id: "user-client",
    firstName: "Layla",
    lastName: "Haddad",
    email: "layla@example.com",
    role: "client",
  },
  {
    id: "user-agent",
    firstName: "Omar",
    lastName: "Farouk",
    email: "omar@example.com",
    role: "sales_agent",
    teamId: "team-central",
  },
  {
    id: "user-manager",
    firstName: "Nadia",
    lastName: "Rahman",
    email: "nadia@example.com",
    role: "sales_manager",
    teamId: "team-central",
  },
  {
    id: "user-admin",
    firstName: "Karim",
    lastName: "Aziz",
    email: "karim@example.com",
    role: "admin",
  },
  {
    id: "user-super-admin",
    firstName: "Rania",
    lastName: "Saleh",
    email: "rania@example.com",
    role: "super_admin",
  },
];

const NOW = "2026-01-01T00:00:00.000Z";

export const demoAccounts: User[] = seeds.map((seed) => ({
  ...seed,
  permissions: permissionsForRole(seed.role),
  status: "active",
  createdAt: NOW,
  updatedAt: NOW,
}));

export function findAccountById(id: string): User | null {
  return demoAccounts.find((account) => account.id === id) ?? null;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  client: "Client",
  sales_agent: "Sales Agent",
  sales_manager: "Sales Manager",
  admin: "Admin",
  super_admin: "Super Admin",
};
