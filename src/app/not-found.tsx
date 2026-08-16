import Link from "next/link";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <main className="flex min-h-0 flex-1 items-center">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="vrs-eyebrow">Not found</p>
        <h1 className="vrs-display mt-3 max-w-xl text-4xl text-[var(--color-bone)]">
          That place doesn&apos;t exist here.
        </h1>
        <p className="vrs-meta mt-4 max-w-md">
          The city, district, project, or residence you followed may have been renamed or
          unpublished.
        </p>
        <Link href={routes.home()} className="vrs-btn mt-8">
          Back to explore
        </Link>
      </div>
    </main>
  );
}
