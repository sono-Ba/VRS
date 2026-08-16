"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import { useSavedStore } from "@/stores/saved-store";

/**
 * Lightweight, dismissible nudge shown only when an action actually needed an
 * account. Exploration is never gated — sign-in is offered at the moment it
 * adds value.
 */
export function AuthPrompt() {
  const pathname = usePathname();
  const authPromptFor = useSavedStore((state) => state.authPromptFor);
  const dismiss = useSavedStore((state) => state.dismissAuthPrompt);

  if (!authPromptFor) return null;

  return (
    <div
      role="status"
      className="vrs-panel fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md p-5 sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <p className="vrs-eyebrow">Keep this</p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--color-bone)]">
        Sign in to {authPromptFor} and pick your journey back up on any device.
      </p>
      <div className="mt-4 flex gap-3">
        <Link
          href={`${routes.signIn()}?next=${encodeURIComponent(pathname)}`}
          className="vrs-btn !min-h-10 flex-1"
          onClick={dismiss}
        >
          Sign in
        </Link>
        <button type="button" onClick={dismiss} className="vrs-btn-ghost !min-h-10">
          Not now
        </button>
      </div>
    </div>
  );
}
