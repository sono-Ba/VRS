import { cookies } from "next/headers";
import type { User } from "@/domain";
import { findAccountById } from "./accounts";
import { can, type Permission } from "./permissions";

export const SESSION_COOKIE = "vrs_session";

/**
 * Server-side session resolution.
 *
 * PROTOTYPE ONLY — the cookie holds a plain account id with no signature or
 * verification, so it is trivially forgeable. Every API route still checks
 * permissions through this module so that swapping in real session validation
 * is a single-file change; the authorization call sites do not move.
 */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const userId = store.get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  return findAccountById(userId);
}

export interface AuthorizationResult {
  user: User | null;
  allowed: boolean;
  reason?: "unauthenticated" | "unauthorized";
}

/** Server-side authorization check, independent of any UI visibility rules. */
export async function authorize(
  permission: Permission
): Promise<AuthorizationResult> {
  const user = await getCurrentUser();
  if (can(user, permission)) return { user, allowed: true };
  return {
    user,
    allowed: false,
    reason: user ? "unauthorized" : "unauthenticated",
  };
}
