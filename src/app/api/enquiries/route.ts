import { getCurrentUser } from "@/auth/session";
import { clientRepositories } from "@/repositories/mock";
import { fail, ok } from "@/services/api/respond";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Guests may enquire — this is the bridge from exploration into the lead flow. */
export async function POST(request: Request) {
  const user = await getCurrentUser();

  let body: {
    projectId?: unknown;
    unitId?: unknown;
    name?: unknown;
    email?: unknown;
    message?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return fail("validation_error", "Request body must be JSON.");
  }

  const details: Record<string, string> = {};
  if (!user) {
    if (typeof body.name !== "string" || body.name.trim().length < 2) {
      details.name = "Tell us your name.";
    }
    if (typeof body.email !== "string" || !EMAIL_PATTERN.test(body.email)) {
      details.email = "Enter a valid email address.";
    }
  }
  if (Object.keys(details).length > 0) {
    return fail("validation_error", "Please check the highlighted fields.", details);
  }

  const enquiry = await clientRepositories.enquiries.create({
    userId: user?.id,
    projectId: typeof body.projectId === "string" ? body.projectId : undefined,
    unitId: typeof body.unitId === "string" ? body.unitId : undefined,
    name: typeof body.name === "string" ? body.name : undefined,
    email: typeof body.email === "string" ? body.email : undefined,
    message: typeof body.message === "string" ? body.message : undefined,
  });

  if (user) {
    const entityType = enquiry.unitId ? "unit" : "project";
    const entityId = enquiry.unitId ?? enquiry.projectId;
    if (entityId) {
      await clientRepositories.interests.set(user.id, entityType, entityId, "enquired");
    }
  }

  return ok(enquiry);
}
