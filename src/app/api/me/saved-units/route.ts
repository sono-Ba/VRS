import { authorize } from "@/auth/session";
import { clientRepositories } from "@/repositories/mock";
import { fail, ok } from "@/services/api/respond";

export async function GET() {
  const { user, allowed, reason } = await authorize("favorites:manage_own");
  if (!allowed || !user) {
    return fail(reason ?? "unauthenticated", "Sign in to see your saved residences.");
  }
  return ok(await clientRepositories.savedUnits.list(user.id));
}

export async function POST(request: Request) {
  const { user, allowed, reason } = await authorize("favorites:manage_own");
  if (!allowed || !user) {
    return fail(reason ?? "unauthenticated", "Sign in to save residences.");
  }

  let body: { projectId?: unknown; unitId?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail("validation_error", "Request body must be JSON.");
  }
  if (typeof body.projectId !== "string" || typeof body.unitId !== "string") {
    return fail("validation_error", "`projectId` and `unitId` are required.");
  }

  const saved = await clientRepositories.savedUnits.add(
    user.id,
    body.projectId,
    body.unitId
  );
  await clientRepositories.interests.set(user.id, "unit", body.unitId, "saved");
  return ok(saved);
}
