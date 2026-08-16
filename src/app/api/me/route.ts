import { getCurrentUser } from "@/auth/session";
import { ok } from "@/services/api/respond";

export async function GET() {
  return ok(await getCurrentUser());
}
