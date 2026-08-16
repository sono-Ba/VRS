import { serverCatalogRepositories } from "@/repositories";
import { fail, ok } from "@/services/api/respond";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; districtSlug: string }> }
) {
  const { slug, districtSlug } = await params;
  const district = await serverCatalogRepositories.districts.getBySlug(
    slug,
    districtSlug
  );
  if (!district) {
    return fail("not_found", `No district matches "${districtSlug}" in "${slug}".`);
  }
  return ok(district);
}
