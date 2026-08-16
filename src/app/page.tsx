import Link from "next/link";
import { getCities } from "@/application/catalog-service";
import { ContinueJourney } from "@/components/client/ContinueJourney";
import { routes } from "@/lib/routes";

export default async function EntryPage() {
  const cities = await getCities();
  const hero = cities[0];

  return (
    <main className="relative min-h-0 flex-1 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url(/media/city.svg)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 92%, transparent) 0%, color-mix(in srgb, var(--color-ink) 55%, transparent) 55%, transparent 100%)",
        }}
      />

      <div className="vrs-scroll relative h-full">
        <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8">
          <p className="vrs-eyebrow">Immersive residential exploration</p>
          <h1 className="vrs-display mt-4 max-w-2xl text-4xl text-[var(--color-bone)] sm:text-5xl lg:text-6xl">
            Walk the city before you walk the room.
          </h1>
          <p className="vrs-meta mt-5 max-w-xl text-[0.9375rem]">
            Move from coastline to district, from masterplan to floor plate, and into a
            single residence — one continuous view, no forms in the way.
          </p>

          {hero ? (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href={routes.city(hero.slug)} className="vrs-btn">
                Explore {hero.name}
              </Link>
              <ContinueJourney />
            </div>
          ) : (
            <p className="vrs-meta mt-10">No cities are published yet.</p>
          )}

          {cities.length > 1 && (
            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <li key={city.id} className="border border-[var(--color-line)]">
                  <Link
                    href={routes.city(city.slug)}
                    className="block p-6 transition-colors hover:bg-[var(--color-ink-raised)]"
                  >
                    <p className="vrs-eyebrow">{city.tagline}</p>
                    <h2 className="vrs-display mt-2 text-2xl">{city.name}</h2>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
