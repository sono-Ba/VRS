import { cookies } from "next/headers";
import { findAccountById } from "@/auth/accounts";
import { SESSION_COOKIE, getCurrentUser } from "@/auth/session";
import { fail, ok } from "@/services/api/respond";

export async function GET() {
  return ok(await getCurrentUser());
}

/**
 * PROTOTYPE ONLY — selects a demo identity with no credential check.
 * Replace with a real identity provider before any non-demo deployment.
 */
export async function POST(request: Request) {
  let body: { accountId?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail("validation_error", "Request body must be JSON.");
  }

  if (typeof body.accountId !== "string") {
    return fail("validation_error", "`accountId` is required.");
  }
  const user = findAccountById(body.accountId);
  if (!user) return fail("not_found", "That account does not exist.");

  const store = await cookies();
  store.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return ok(user);
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return ok(null);
}
