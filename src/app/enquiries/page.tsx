import { getProject, getUnit } from "@/application/catalog-service";
import { getCurrentUser } from "@/auth/session";
import { PageFrame } from "@/components/layout/PageFrame";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import { ENQUIRY_STATUS_CLIENT_LABEL } from "@/lib/labels";
import { routes } from "@/lib/routes";
import { clientRepositories } from "@/repositories/mock";

export default async function EnquiriesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <PageFrame
        eyebrow="Enquiries"
        title="Your conversations"
        description="Sign in to follow the enquiries you have sent."
      >
        <EmptyState
          title="Sign in to see your enquiries"
          description="You can send an enquiry as a guest — signing in keeps them together in one place."
          action={{ href: routes.signIn(), label: "Sign in" }}
        />
      </PageFrame>
    );
  }

  const enquiries = await clientRepositories.enquiries.listForUser(user.id);
  const enriched = await Promise.all(
    enquiries.map(async (enquiry) => ({
      enquiry,
      project: enquiry.projectId ? await getProject(enquiry.projectId) : null,
      unit: enquiry.unitId ? await getUnit(enquiry.unitId) : null,
    }))
  );

  return (
    <PageFrame
      eyebrow="Enquiries"
      title="Your conversations"
      description="Everything you have asked about, and where each one stands."
    >
      {enriched.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          description="When something interests you, send an enquiry from the project or residence and it will appear here."
          action={{ href: routes.home(), label: "Start exploring" }}
        />
      ) : (
        <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {enriched.map(({ enquiry, project, unit }) => (
            <li
              key={enquiry.id}
              className="flex flex-wrap items-baseline justify-between gap-4 py-5"
            >
              <div className="min-w-0">
                <p className="vrs-eyebrow">{formatDate(enquiry.createdAt)}</p>
                <p className="vrs-display mt-1.5 text-xl text-[var(--color-bone)]">
                  {unit ? `Unit ${unit.unitNumber}` : (project?.name ?? "General enquiry")}
                </p>
                {unit && project && (
                  <p className="vrs-meta mt-1 text-[0.8125rem]">{project.name}</p>
                )}
                {enquiry.message && (
                  <p className="vrs-meta mt-2 max-w-xl text-[0.8125rem]">
                    {enquiry.message}
                  </p>
                )}
              </div>
              <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--color-sand)]">
                {ENQUIRY_STATUS_CLIENT_LABEL[enquiry.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </PageFrame>
  );
}
