import { serverCatalogRepositories } from "@/repositories";
import { fail, ok } from "@/services/api/respond";

export async function GET(request: Request) {
  const buildingId = new URL(request.url).searchParams.get("buildingId");
  if (!buildingId) return fail("validation_error", "`buildingId` is required.");
  return ok(await serverCatalogRepositories.floors.getByBuilding(buildingId));
}
