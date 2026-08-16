import { serverCatalogRepositories } from "@/repositories";
import { fail, ok } from "@/services/api/respond";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const floor = await serverCatalogRepositories.floors.getById(id);
  if (!floor) return fail("not_found", `No floor matches "${id}".`);
  return ok(floor);
}
