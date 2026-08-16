import { serverCatalogRepositories } from "@/repositories";
import { fail, ok } from "@/services/api/respond";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await serverCatalogRepositories.projects.getById(id);
  if (!project) return fail("not_found", `No project matches "${id}".`);
  return ok(project);
}
