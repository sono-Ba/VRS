"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROLE_LABELS } from "@/auth/accounts";
import type { User } from "@/domain";
import { useSessionStore } from "@/stores/session-store";

/**
 * PROTOTYPE ONLY — picks a demo identity with no credential check, so every
 * role can be reviewed end to end. Real authentication replaces this screen
 * without touching the permission model behind it.
 */
export function SignInOptions({
  accounts,
  next,
}: {
  accounts: User[];
  next?: string;
}) {
  const router = useRouter();
  const signIn = useSessionStore((state) => state.signIn);
  const pending = useSessionStore((state) => state.pending);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  async function choose(accountId: string) {
    setSelected(accountId);
    setError(null);
    try {
      await signIn(accountId);
      router.push(next && next.startsWith("/") ? next : "/");
      router.refresh();
    } catch {
      setSelected(null);
      setError("We could not sign you in. Please try again.");
    }
  }

  return (
    <div>
      <div
        role="note"
        className="border border-[var(--color-line)] px-4 py-3 text-[0.8125rem] text-[var(--color-bone-dim)]"
      >
        Prototype sign-in. These are demo identities with no password and no real
        authentication — they exist so each role&apos;s experience can be reviewed.
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <li key={account.id} className="border border-[var(--color-line)]">
            <button
              type="button"
              disabled={pending}
              onClick={() => void choose(account.id)}
              className="flex w-full flex-col items-start bg-[var(--color-ink)] p-5 text-left transition-colors hover:bg-[var(--color-ink-raised)] disabled:opacity-60"
            >
              <span className="vrs-eyebrow">{ROLE_LABELS[account.role]}</span>
              <span className="vrs-display mt-2 text-xl text-[var(--color-bone)]">
                {account.firstName} {account.lastName}
              </span>
              <span className="vrs-meta mt-1 text-[0.75rem]">{account.email}</span>
              <span className="mt-4 text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--color-sand)]">
                {selected === account.id && pending
                  ? "Signing in…"
                  : `${account.permissions.length} capabilities`}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {error && (
        <p role="alert" className="mt-4 text-[0.8125rem] text-[var(--color-sold)]">
          {error}
        </p>
      )}
    </div>
  );
}
