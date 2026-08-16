# Prompt to Start Claude Code

Read `CLAUDE.md` and every referenced document before making major changes.

Operate as a combined **Technology Executive + Principal Architect + Product Design Leader**.

Your job is not simply to generate code. Your job is to evolve this repository into a coherent immersive real-estate platform while balancing business value, user experience, architecture, engineering quality, security, scalability, performance, maintainability, delivery velocity, and long-term evolution.

## First Task

Inspect the existing repository completely enough to understand:

- framework and project structure
- dependencies
- routes
- current navigation
- current breadcrumb implementation
- responsive behavior
- viewer implementation(s)
- state management
- existing APIs or mock data
- authentication/authorization assumptions
- styling/design system
- testing/build/deployment setup

Do not blindly replace existing working architecture.

## Then Produce a Concise Assessment

Before major edits, report:

1. Current architecture
2. What is reusable
3. Key risks/debt
4. Gaps against the documented target architecture
5. Whether each gap is Prototype, MVP, Production, or Enterprise concern
6. Recommended implementation sequence

Keep this assessment actionable, not academic.

## Immediate Product Priorities

### A. Breadcrumb

Move the breadcrumb directly below the main top bar and align it to the left on desktop.

It must remain contextual to:

```text
City / District / Project / Experience / Building / Floor / Unit
```

Parent levels should be navigable and should update route/application/viewer state appropriately.

### B. Responsive Experience

Create an elegant, professional transformation between Desktop, Tablet, and Mobile.

Do not simply shrink desktop UI.

Preserve the current city/district/project/building/floor/unit/viewer state through viewport and orientation changes.

Use patterns such as:

```text
Desktop floating panel
→ Tablet compact panel
→ Mobile bottom sheet
```

### C. Roles / RBAC

Architect for:

- Client
- Sales Agent
- Sales Manager
- Admin
- Super Admin

Use centralized permissions/capabilities, not scattered role comparisons.

### D. Client Experience

Keep the client experience elegant and simple.

Guests explore freely.

Authenticated clients may:

- save projects
- save units
- compare projects
- compare units
- track interests
- see recently viewed
- continue previous journey
- manage enquiries

Login should enhance the journey, not block exploration.

### E. API-First Local Data

For anything that could later come from a real API, create a local API/service/repository abstraction now.

UI components must not directly import mock JSON.

Use replaceable implementations such as:

```text
Repository Interface
├── Mock Repository today
└── HTTP Repository later
```

## Implementation Order

Do not build every feature at once.

Proceed in this order:

```text
1. Repository assessment
2. Domain/API/auth/RBAC foundation
3. Responsive application shell
4. Top bar + breadcrumb
5. Viewer shell/controller boundaries
6. City → District → Project vertical slice
7. Building → Floor → Unit
8. Client save/compare/interest/journey features
9. Sales Agent
10. Sales Manager
11. Admin
12. Super Admin
13. Production hardening
```

After each major stage:

- run type checks
- run lint
- run tests where available
- run/build the application
- fix regressions
- review UX
- review permissions
- review responsive behavior
- review failure states
- review performance impact

## Critical Rule

If a requested implementation creates avoidable coupling or premature complexity, challenge it and propose a better alternative.

Do not over-engineer the prototype, but do create inexpensive boundaries that make real APIs, authentication, viewers, and enterprise integrations replaceable later.

Start now with repository inspection and architecture assessment.
