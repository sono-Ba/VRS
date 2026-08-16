import { getCurrentUser } from "@/auth/session";
import { clientRepositories } from "@/repositories/mock";
import { fail, ok } from "@/services/api/respond";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated", "Sign in to see your enquiries.");
  return ok(await clientRepositories.enquiries.listForUser(user.id));
}
