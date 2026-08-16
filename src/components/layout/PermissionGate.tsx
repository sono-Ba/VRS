import Link from "next/link";
import type { ReactNode } from "react";
import type { Permission } from "@/auth/permissions";
import { authorize } from "@/auth/session";
import { PageFrame } from "./PageFrame";
import { routes } from "@/lib/routes";

/**
 * Central route guard for operational surfaces. The check runs on the server;
 * the corresponding API routes enforce the same permissions independently, so
 * this is a navigation affordance rather than the security boundary.
 */
export async function PermissionGate({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { allowed, reason } = await authorize(permission);
  if (allowed) return <>{children}</>;

  if (reason === "unauthenticated") {
    return (
      <PageFrame
        eyebrow="Restricted"
        title="Sign in to continue"
        description="This area is available to signed-in staff."
        actions={
          <Link href={routes.signIn()} className="vrs-btn">
            Sign in
          </Link>
        }
      >
        <p className="vrs-meta">
          Client exploration stays open to everyone — only this workspace needs an
          account.
        </p>
      </PageFrame>
    );
  }

  return (
    <PageFrame
      eyebrow="Restricted"
      title="You do not have access"
      description="Your role does not include this capability."
      actions={
        <Link href={routes.home()} className="vrs-btn-ghost">
          Back to explore
        </Link>
      }
    >
      <p className="vrs-meta">
        If you believe this is wrong, ask an administrator to review your permissions.
      </p>
    </PageFrame>
  );
}
