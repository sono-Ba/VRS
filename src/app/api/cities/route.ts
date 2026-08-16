import { serverCatalogRepositories } from "@/repositories";
import { ok } from "@/services/api/respond";

export async function GET() {
  return ok(await serverCatalogRepositories.cities.getAll());
}
