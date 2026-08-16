import { getCurrentUser } from "@/auth/session";
import type { JourneySnapshot } from "@/domain";
import { clientRepositories } from "@/repositories/mock";
import { fail, ok } from "@/services/api/respond";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated", "Sign in to resume your journey.");
  return ok(await clientRepositories.journey.get(user.id));
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return ok(null);

  let body: Partial<JourneySnapshot>;
  try {
    body = await request.json();
  } catch {
    return fail("validation_error", "Request body must be JSON.");
  }
  if (typeof body.path !== "string") {
    return fail("validation_error", "`path` is required.");
  }

  const snapshot: JourneySnapshot = {
    cityId: body.cityId,
    districtId: body.districtId,
    projectId: body.projectId,
    buildingId: body.buildingId,
    floorId: body.floorId,
    unitId: body.unitId,
    path: body.path,
    updatedAt: new Date().toISOString(),
  };
  await clientRepositories.journey.save(user.id, snapshot);
  return ok(snapshot);
}
