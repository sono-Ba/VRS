import { authorize } from "@/auth/session";
import type { ClientInterest, InterestLevel } from "@/domain";
import { clientRepositories } from "@/repositories/mock";
import { fail, ok } from "@/services/api/respond";

const LEVELS: InterestLevel[] = [
  "viewed",
  "saved",
  "interested",
  "high_interest",
  "enquired",
];

export async function GET() {
  const { user, allowed, reason } = await authorize("interests:manage_own");
  if (!allowed || !user) {
    return fail(reason ?? "unauthenticated", "Sign in to track your interests.");
  }
  return ok(await clientRepositories.interests.list(user.id));
}

export async function POST(request: Request) {
  const { user, allowed, reason } = await authorize("interests:manage_own");
  if (!allowed || !user) {
    return fail(reason ?? "unauthenticated", "Sign in to track your interests.");
  }

  let body: { entityType?: unknown; entityId?: unknown; level?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail("validation_error", "Request body must be JSON.");
  }

  if (body.entityType !== "project" && body.entityType !== "unit") {
    return fail("validation_error", "`entityType` must be `project` or `unit`.");
  }
  if (typeof body.entityId !== "string") {
    return fail("validation_error", "`entityId` is required.");
  }
  if (!LEVELS.includes(body.level as InterestLevel)) {
    return fail("validation_error", `\`level\` must be one of: ${LEVELS.join(", ")}.`);
  }

  const record = await clientRepositories.interests.set(
    user.id,
    body.entityType as ClientInterest["entityType"],
    body.entityId,
    body.level as InterestLevel
  );
  return ok(record);
}
