import Link from "next/link";
import { getProject, getUnit } from "@/application/catalog-service";
import { linkForProject, linkForUnit } from "@/application/links";
import { authorize } from "@/auth/session";
import { PageFrame } from "@/components/layout/PageFrame";
import { EmptyState } from "@/components/ui/EmptyState";
import { AvailabilityPill } from "@/components/ui/StatusPill";
import { formatArea, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { clientRepositories } from "@/repositories/mock";

export default async function SavedPage() {
  const { user, allowed } = await authorize("favorites:manage_own");

  if (!allowed || !user) {
    return (
      <PageFrame
        eyebrow="Saved"
        title="Your shortlist lives here"
        description="Sign in to keep projects and residences across visits and devices."
      >
        <EmptyState
          title="Nothing saved yet"
          description="Exploration is open to everyone. Signing in is only needed to remember what you liked."
          action={{ href: routes.signIn(), label: "Sign in" }}
        />
      </PageFrame>
    );
  }

  const [savedProjects, savedUnits] = await Promise.all([
    clientRepositories.savedProjects.list(user.id),
    clientRepositories.savedUnits.list(user.id),
  ]);

  const projects = (
    await Promise.all(
      savedProjects.map(async (saved) => {
        const project = await getProject(saved.projectId);
        if (!project) return null;
        return { project, href: await linkForProject(project) };
      })
    )
  ).filter((entry) => entry !== null);

  const units = (
    await Promise.all(
      savedUnits.map(async (saved) => {
        const unit = await getUnit(saved.unitId);
        if (!unit) return null;
        const project = await getProject(unit.projectId);
        return { unit, project, href: await linkForUnit(unit) };
      })
    )
  ).filter((entry) => entry !== null);

  const nothingSaved = projects.length === 0 && units.length === 0;

  return (
    <PageFrame
      eyebrow="Saved"
      title={`Your shortlist, ${user.firstName}`}
      description="Everything you have kept, ready to pick back up."
      actions={
        !nothingSaved ? (
          <Link href={routes.compare()} className="vrs-btn-ghost">
            Open compare
          </Link>
        ) : undefined
      }
    >
      {nothingSaved ? (
        <EmptyState
          title="Nothing saved yet"
          description="Save a project or a residence while exploring and it will appear here."
          action={{ href: routes.home(), label: "Start exploring" }}
        />
      ) : (
        <div className="space-y-12">
          {projects.length > 0 && (
            <section>
              <h2 className="vrs-eyebrow">Projects</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map(({ project, href }) => (
                  <li key={project.id} className="border border-[var(--color-line)]">
                    <ConditionalLink href={href}>
                      <p className="vrs-eyebrow">{project.developer}</p>
                      <p className="vrs-display mt-2 text-xl text-[var(--color-bone)]">
                        {project.name}
                      </p>
                      <p className="vrs-meta mt-2 text-[0.8125rem]">
                        From {formatPrice(project.startingPrice)} · {project.handover}
                      </p>
                    </ConditionalLink>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {units.length > 0 && (
            <section>
              <h2 className="vrs-eyebrow">Residences</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {units.map(({ unit, project, href }) => (
                  <li key={unit.id} className="border border-[var(--color-line)]">
                    <ConditionalLink href={href}>
                      <p className="vrs-eyebrow">{project?.name ?? "Project"}</p>
                      <p className="vrs-display mt-2 text-xl text-[var(--color-bone)]">
                        Unit {unit.unitNumber}
                      </p>
                      <p className="vrs-meta mt-2 text-[0.8125rem]">
                        {unit.unitType} · {formatArea(unit.netArea)} · {unit.viewEN}
                      </p>
                      <p className="mt-3 flex items-center justify-between gap-3">
                        <AvailabilityPill availability={unit.availability} />
                        <span className="text-[0.8125rem] text-[var(--color-bone-dim)]">
                          {formatPrice(unit.actualPrice)}
                        </span>
                      </p>
                    </ConditionalLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </PageFrame>
  );
}

/** Renders a card that only links when the entity's ancestry resolved. */
function ConditionalLink({
  href,
  children,
}: {
  href: string | null;
  children: React.ReactNode;
}) {
  const className = "block p-5 transition-colors hover:bg-[var(--color-ink-raised)]";
  if (!href) return <div className={className}>{children}</div>;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
