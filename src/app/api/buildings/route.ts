import { serverCatalogRepositories } from "@/repositories";
import { fail, ok } from "@/services/api/respond";

export async function GET(request: Request) {
  const projectId = new URL(request.url).searchParams.get("projectId");
  if (!projectId) return fail("validation_error", "`projectId` is required.");
  return ok(await serverCatalogRepositories.buildings.getByProject(projectId));
}
