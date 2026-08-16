import { authorize } from "@/auth/session";
import { clientRepositories } from "@/repositories/mock";
import { fail, ok } from "@/services/api/respond";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { user, allowed, reason } = await authorize("favorites:manage_own");
  if (!allowed || !user) {
    return fail(reason ?? "unauthenticated", "Sign in to manage saved projects.");
  }
  const { projectId } = await params;
  await clientRepositories.savedProjects.remove(user.id, projectId);
  return ok(null);
}
