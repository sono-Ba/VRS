"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // A real deployment forwards this to the error reporting service.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-0 flex-1 items-center">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="vrs-eyebrow">Something went wrong</p>
        <h1 className="vrs-display mt-3 max-w-xl text-4xl text-[var(--color-bone)]">
          We lost the thread for a moment.
        </h1>
        <p className="vrs-meta mt-4 max-w-md">
          The experience failed to load. Trying again usually resolves it.
        </p>
        <button type="button" onClick={reset} className="vrs-btn mt-8">
          Try again
        </button>
      </div>
    </main>
  );
}
