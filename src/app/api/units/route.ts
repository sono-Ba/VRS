import { authorize } from "@/auth/session";
import type { Unit } from "@/domain";
import { serverCatalogRepositories } from "@/repositories";
import type { UnitQuery } from "@/repositories/interfaces";
import { fail, ok } from "@/services/api/respond";

/**
 * Price is stripped server-side when the caller lacks `units:view_price`.
 * Hiding it in the UI alone would not be an authorization boundary.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const { allowed: canViewUnits } = await authorize("units:view");
  if (!canViewUnits) return fail("unauthorized", "You cannot view inventory.");

  const ids = params.get("ids");
  let units: Unit[];
  if (ids) {
    units = await serverCatalogRepositories.units.getByIds(ids.split(",").filter(Boolean));
  } else {
    const bedrooms = params.get("bedrooms");
    const query: UnitQuery = {
      projectId: params.get("projectId") ?? undefined,
      buildingId: params.get("buildingId") ?? undefined,
      floorId: params.get("floorId") ?? undefined,
      availability: (params.get("availability") as Unit["availability"]) ?? undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
    };
    units = await serverCatalogRepositories.units.getAll(query);
  }

  const { allowed: canViewPrice } = await authorize("units:view_price");
  if (!canViewPrice) {
    units = units.map(({ actualPrice: _actualPrice, ...rest }) => rest);
  }
  return ok(units);
}
