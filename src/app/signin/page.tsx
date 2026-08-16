import { demoAccounts } from "@/auth/accounts";
import { PageFrame } from "@/components/layout/PageFrame";
import { SignInOptions } from "./SignInOptions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <PageFrame
      eyebrow="Optional"
      title="Sign in to keep your journey"
      description="Exploration never requires an account. Sign in when you want to save residences, keep a comparison, or pick things up on another device."
    >
      <SignInOptions accounts={demoAccounts} next={next} />
    </PageFrame>
  );
}
