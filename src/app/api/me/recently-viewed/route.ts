import { getCurrentUser } from "@/auth/session";
import { clientRepositories } from "@/repositories/mock";
import { fail, ok } from "@/services/api/respond";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated", "Sign in to see recently viewed items.");
  return ok(await clientRepositories.recentlyViewed.list(user.id));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  // Recording history for a guest is a no-op rather than an error: exploration
  // must never be interrupted by an auth failure.
  if (!user) return ok(null);

  let body: { entityType?: unknown; entityId?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail("validation_error", "Request body must be JSON.");
  }
  if (body.entityType !== "project" && body.entityType !== "unit") {
    return fail("validation_error", "`entityType` must be `project` or `unit`.");
  }
  if (typeof body.entityId !== "string") {
    return fail("validation_error", "`entityId` is required.");
  }

  await clientRepositories.recentlyViewed.record(
    user.id,
    body.entityType,
    body.entityId
  );
  return ok(null);
}
