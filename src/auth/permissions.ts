/**
 * Centralized RBAC. Roles are bundles of default permissions;
 * UI and services check capabilities via `can()`, never `user.role === '...'`.
 */

export type UserRole =
  | "client"
  | "sales_agent"
  | "sales_manager"
  | "admin"
  | "super_admin";

export type Permission =
  | "projects:view"
  | "projects:manage"
  | "units:view"
  | "units:view_price"
  | "units:view_internal_data"
  | "units:reserve"
  | "favorites:manage_own"
  | "compare:manage_own"
  | "interests:manage_own"
  | "leads:create"
  | "leads:view_own"
  | "leads:view_team"
  | "leads:view_all"
  | "leads:manage"
  | "sales_sessions:create"
  | "sales_sessions:view_own"
  | "sales_sessions:view_team"
  | "users:view"
  | "users:manage"
  | "analytics:view_own"
  | "analytics:view_team"
  | "analytics:view_all"
  | "content:manage"
  | "inventory:manage"
  | "roles:manage"
  | "integrations:manage"
  | "system:manage"
  | "audit:view";

/** Capabilities available without authentication (guest exploration is free). */
export const GUEST_PERMISSIONS: Permission[] = [
  "projects:view",
  "units:view",
  "units:view_price",
];

const CLIENT_PERMISSIONS: Permission[] = [
  ...GUEST_PERMISSIONS,
  "favorites:manage_own",
  "compare:manage_own",
  "interests:manage_own",
  "leads:create",
];

const SALES_AGENT_PERMISSIONS: Permission[] = [
  ...CLIENT_PERMISSIONS,
  "units:view_internal_data",
  "units:reserve",
  "leads:view_own",
  "leads:manage",
  "sales_sessions:create",
  "sales_sessions:view_own",
  "analytics:view_own",
];

const SALES_MANAGER_PERMISSIONS: Permission[] = [
  ...SALES_AGENT_PERMISSIONS,
  "leads:view_team",
  "sales_sessions:view_team",
  "analytics:view_team",
  "users:view",
];

const ADMIN_PERMISSIONS: Permission[] = [
  ...SALES_MANAGER_PERMISSIONS,
  "leads:view_all",
  "analytics:view_all",
  "projects:manage",
  "content:manage",
  "inventory:manage",
  "users:manage",
];

const SUPER_ADMIN_PERMISSIONS: Permission[] = [
  ...ADMIN_PERMISSIONS,
  "roles:manage",
  "integrations:manage",
  "system:manage",
  "audit:view",
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  client: CLIENT_PERMISSIONS,
  sales_agent: SALES_AGENT_PERMISSIONS,
  sales_manager: SALES_MANAGER_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
  super_admin: SUPER_ADMIN_PERMISSIONS,
};

export interface PermissionHolder {
  permissions: Permission[];
}

/** Single authorization entry point. `user` null/undefined = guest. */
export function can(
  user: PermissionHolder | null | undefined,
  permission: Permission
): boolean {
  const granted = user ? user.permissions : GUEST_PERMISSIONS;
  return granted.includes(permission);
}

export function permissionsForRole(role: UserRole): Permission[] {
  return [...new Set(ROLE_PERMISSIONS[role])];
}
