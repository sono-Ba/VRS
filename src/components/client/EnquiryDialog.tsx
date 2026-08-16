"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Enquiry } from "@/domain";
import { analytics } from "@/services/analytics";
import { ApiClientError } from "@/services/api/contract";
import { apiFetch } from "@/services/api/http";
import { useSessionStore } from "@/stores/session-store";

interface EnquiryDialogProps {
  projectId: string;
  projectName: string;
  unitId?: string;
  unitLabel?: string;
  className?: string;
}

type Status = "idle" | "submitting" | "sent";

/**
 * Guests can enquire without an account — this is the bridge from exploration
 * into the lead flow. Signed-in clients skip the contact fields entirely.
 */
export function EnquiryDialog({
  projectId,
  projectName,
  unitId,
  unitLabel,
  className,
}: EnquiryDialogProps) {
  const user = useSessionStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    analytics.track("enquiry_started", { projectId, unitId });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, projectId, unitId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("submitting");
    setFieldErrors({});
    setFormError(null);

    try {
      await apiFetch<Enquiry>("/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          unitId,
          name: form.get("name") ?? undefined,
          email: form.get("email") ?? undefined,
          message: form.get("message") ?? undefined,
        }),
      });
      analytics.track("enquiry_submitted", { projectId, unitId });
      setStatus("sent");
    } catch (error) {
      setStatus("idle");
      if (error instanceof ApiClientError) {
        setFieldErrors(error.details ?? {});
        setFormError(error.details ? null : error.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  }

  const target = unitLabel ? `${unitLabel}, ${projectName}` : projectName;

  // Portalled to the body: the contextual panel uses backdrop-filter, which
  // makes it a containing block for fixed-position descendants and would trap
  // the dialog inside the rail.
  const dialog = open
    ? createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[color-mix(in_srgb,var(--color-ink)_75%,transparent)] p-4 backdrop-blur-sm sm:items-center"
          onPointerDown={(event) => {
            if (!dialogRef.current?.contains(event.target as Node)) setOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Enquire about ${target}`}
            className="vrs-panel w-full max-w-md p-6"
          >
            {status === "sent" ? (
              <>
                <p className="vrs-eyebrow">Enquiry received</p>
                <h2 className="vrs-display mt-2 text-2xl">We&apos;ll be in touch</h2>
                <p className="vrs-meta mt-3">
                  A sales advisor will follow up about {target}.
                </p>
                <button
                  type="button"
                  className="vrs-btn-ghost mt-6 w-full"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </>
            ) : (
              <form onSubmit={submit} noValidate>
                <p className="vrs-eyebrow">Enquiry</p>
                <h2 className="vrs-display mt-2 text-2xl">{target}</h2>

                {!user && (
                  <div className="mt-5 space-y-4">
                    <div>
                      <label htmlFor="enquiry-name" className="vrs-eyebrow block">
                        Name
                      </label>
                      <input
                        id="enquiry-name"
                        name="name"
                        className="vrs-input mt-1.5"
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={fieldErrors.name ? "enquiry-name-error" : undefined}
                      />
                      {fieldErrors.name && (
                        <p
                          id="enquiry-name-error"
                          className="mt-1.5 text-[0.75rem] text-[var(--color-sold)]"
                        >
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="enquiry-email" className="vrs-eyebrow block">
                        Email
                      </label>
                      <input
                        id="enquiry-email"
                        name="email"
                        type="email"
                        className="vrs-input mt-1.5"
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={
                          fieldErrors.email ? "enquiry-email-error" : undefined
                        }
                      />
                      {fieldErrors.email && (
                        <p
                          id="enquiry-email-error"
                          className="mt-1.5 text-[0.75rem] text-[var(--color-sold)]"
                        >
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label htmlFor="enquiry-message" className="vrs-eyebrow block">
                    Message <span className="normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    id="enquiry-message"
                    name="message"
                    rows={3}
                    className="vrs-input mt-1.5 resize-none py-2.5"
                  />
                </div>

                {formError && (
                  <p role="alert" className="mt-4 text-[0.8125rem] text-[var(--color-sold)]">
                    {formError}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="vrs-btn flex-1"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending…" : "Send enquiry"}
                  </button>
                  <button
                    type="button"
                    className="vrs-btn-ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStatus("idle");
          setOpen(true);
        }}
        className={`vrs-btn ${className ?? ""}`}
      >
        Enquire
      </button>
      {dialog}
    </>
  );
}
