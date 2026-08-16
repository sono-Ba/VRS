import { serverCatalogRepositories } from "@/repositories";
import { fail, ok } from "@/services/api/respond";

export async function GET(request: Request) {
  const cityId = new URL(request.url).searchParams.get("cityId");
  if (!cityId) return fail("validation_error", "`cityId` is required.");
  return ok(await serverCatalogRepositories.districts.getByCity(cityId));
}
