import { serverCatalogRepositories } from "@/repositories";
import { fail, ok } from "@/services/api/respond";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const building = await serverCatalogRepositories.buildings.getById(id);
  if (!building) return fail("not_found", `No building matches "${id}".`);
  return ok(building);
}
