import { serverCatalogRepositories } from "@/repositories";
import { fail, ok } from "@/services/api/respond";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const city = await serverCatalogRepositories.cities.getBySlug(slug);
  if (!city) return fail("not_found", `No city matches "${slug}".`);
  return ok(city);
}
