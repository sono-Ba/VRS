import type { UnitAvailability } from "@/domain";
import { AVAILABILITY_LABEL } from "@/lib/labels";

const AVAILABILITY_COLOR: Record<UnitAvailability, string> = {
  available: "var(--color-available)",
  reserved: "var(--color-reserved)",
  sold: "var(--color-sold)",
};

export function AvailabilityPill({
  availability,
}: {
  availability: UnitAvailability | undefined;
}) {
  if (!availability) return null;
  const label = AVAILABILITY_LABEL[availability];
  const color = AVAILABILITY_COLOR[availability];
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.14em]">
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      <span style={{ color }}>{label}</span>
    </span>
  );
}
