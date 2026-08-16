import { authorize } from "@/auth/session";
import { serverCatalogRepositories } from "@/repositories";
import { fail, ok } from "@/services/api/respond";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { allowed: canViewUnits } = await authorize("units:view");
  if (!canViewUnits) return fail("unauthorized", "You cannot view inventory.");

  const { id } = await params;
  const unit = await serverCatalogRepositories.units.getById(id);
  if (!unit) return fail("not_found", `No unit matches "${id}".`);

  const { allowed: canViewPrice } = await authorize("units:view_price");
  if (!canViewPrice) {
    const { actualPrice: _actualPrice, ...rest } = unit;
    return ok(rest);
  }
  return ok(unit);
}
