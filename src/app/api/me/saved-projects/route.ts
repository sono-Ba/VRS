import { authorize } from "@/auth/session";
import { clientRepositories } from "@/repositories/mock";
import { fail, ok } from "@/services/api/respond";

export async function GET() {
  const { user, allowed, reason } = await authorize("favorites:manage_own");
  if (!allowed || !user) {
    return fail(reason ?? "unauthenticated", "Sign in to see your saved projects.");
  }
  return ok(await clientRepositories.savedProjects.list(user.id));
}

export async function POST(request: Request) {
  const { user, allowed, reason } = await authorize("favorites:manage_own");
  if (!allowed || !user) {
    return fail(reason ?? "unauthenticated", "Sign in to save projects.");
  }

  let body: { projectId?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail("validation_error", "Request body must be JSON.");
  }
  if (typeof body.projectId !== "string") {
    return fail("validation_error", "`projectId` is required.");
  }

  const saved = await clientRepositories.savedProjects.add(user.id, body.projectId);
  await clientRepositories.interests.set(user.id, "project", body.projectId, "saved");
  return ok(saved);
}
