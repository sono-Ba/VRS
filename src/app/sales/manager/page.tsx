import { getProject, getProjects } from "@/application/catalog-service";
import { demoAccounts, ROLE_LABELS } from "@/auth/accounts";
import { PageFrame } from "@/components/layout/PageFrame";
import { PermissionGate } from "@/components/layout/PermissionGate";
import { clientRepositories } from "@/repositories/mock";

export default function SalesManagerPage() {
  return (
    <PermissionGate permission="leads:view_team">
      <TeamOverview />
    </PermissionGate>
  );
}

async function TeamOverview() {
  const [enquiries, projects] = await Promise.all([
    clientRepositories.enquiries.listAll(),
    getProjects(),
  ]);

  const demandByProject = new Map<string, number>();
  for (const enquiry of enquiries) {
    if (!enquiry.projectId) continue;
    demandByProject.set(
      enquiry.projectId,
      (demandByProject.get(enquiry.projectId) ?? 0) + 1
    );
  }

  const demand = await Promise.all(
    [...demandByProject.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(async ([projectId, count]) => ({
        project: await getProject(projectId),
        count,
      }))
  );

  const team = demoAccounts.filter(
    (account) => account.role === "sales_agent" || account.role === "sales_manager"
  );
  const unassigned = enquiries.filter((e) => !e.assignedAgentId).length;

  return (
    <PageFrame
      eyebrow="Team"
      title="Team overview"
      description="Where demand is concentrating and what is waiting to be picked up."
    >
      <dl className="grid gap-px border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-3">
        <Metric label="Enquiries" value={enquiries.length.toString()} />
        <Metric label="Unassigned" value={unassigned.toString()} />
        <Metric label="Live projects" value={projects.length.toString()} />
      </dl>

      <section className="mt-12">
        <h2 className="vrs-eyebrow">Project demand</h2>
        {demand.length === 0 ? (
          <p className="vrs-meta mt-4">
            No enquiries yet — demand appears here as clients start reaching out.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {demand.map(({ project, count }) => (
              <li
                key={project?.id ?? count}
                className="flex items-baseline justify-between gap-4 py-4"
              >
                <span className="text-[0.9375rem] text-[var(--color-bone)]">
                  {project?.name ?? "Unknown project"}
                </span>
                <span className="text-[0.8125rem] text-[var(--color-sand)]">
                  {count} {count === 1 ? "enquiry" : "enquiries"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="vrs-eyebrow">Team</h2>
        <ul className="mt-4 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {team.map((member) => (
            <li
              key={member.id}
              className="flex items-baseline justify-between gap-4 py-4"
            >
              <span className="min-w-0">
                <span className="block text-[0.9375rem] text-[var(--color-bone)]">
                  {member.firstName} {member.lastName}
                </span>
                <span className="vrs-meta block text-[0.75rem]">{member.email}</span>
              </span>
              <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--color-bone-faint)]">
                {ROLE_LABELS[member.role]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="vrs-meta mt-10 border-t border-[var(--color-line)] pt-6 text-[0.8125rem]">
        Session review and reassignment arrive once sales sessions are persisted against
        real agent accounts.
      </p>
    </PageFrame>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-ink)] p-6">
      <dt className="vrs-eyebrow">{label}</dt>
      <dd className="vrs-display mt-2 text-3xl text-[var(--color-bone)]">{value}</dd>
    </div>
  );
}
