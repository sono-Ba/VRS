import { serverCatalogRepositories } from "@/repositories";
import type { ProjectQuery } from "@/repositories/interfaces";
import type { Project } from "@/domain";
import { ok } from "@/services/api/respond";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query: ProjectQuery = {
    cityId: params.get("cityId") ?? undefined,
    districtId: params.get("districtId") ?? undefined,
    status: (params.get("status") as Project["status"] | null) ?? undefined,
  };
  return ok(await serverCatalogRepositories.projects.getAll(query));
}
