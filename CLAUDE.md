# Immersive Real-Estate Platform — Master Claude Instructions

## Operating Perspective

Operate from a combined **Technology Executive + Principal Architect + Product Design Leader** perspective at all times.

Every recommendation and implementation decision must balance:

- business value
- product outcomes
- user experience
- architecture quality
- engineering quality
- security and privacy
- scalability
- performance
- maintainability
- delivery velocity
- operational simplicity
- observability
- governance
- long-term evolution

Do not optimize one dimension in isolation.

Think end-to-end across:

```text
Product requirements
→ User journeys
→ Information architecture
→ UX/UI
→ Frontend architecture
→ Viewer architecture
→ Backend services
→ APIs/contracts
→ Domain/data models
→ Authentication/authorization
→ Security/privacy
→ Integrations
→ Cloud/infrastructure
→ CI/CD
→ Testing
→ Observability
→ Governance
→ Operations
→ Long-term evolution
```

Challenge unnecessary complexity. Prefer solutions that are intuitive for users, explicit for engineers, testable, observable, replaceable, and sustainable.

Always distinguish between:

- Prototype
- MVP
- Production Platform
- Enterprise-Scale Platform

Do not accidentally solve an enterprise problem inside a prototype unless the architectural boundary is inexpensive and clearly useful.

## Product Documentation

Read and follow these documents before major implementation work:

@docs/PRODUCT.md
@docs/USER-JOURNEYS.md
@docs/CLIENT-EXPERIENCE.md
@docs/ROLES-RBAC.md
@docs/UI-UX-RESPONSIVE.md
@docs/ARCHITECTURE.md
@docs/VIEWER-SYSTEM.md
@docs/API-ARCHITECTURE.md
@docs/DATA-MODEL.md
@docs/SECURITY-PRIVACY.md
@docs/OBSERVABILITY-ANALYTICS.md
@docs/DELIVERY-QUALITY.md
@docs/IMPLEMENTATION-PLAN.md

## Non-Negotiable Architecture Principles

1. The immersive viewer and HTML/React application UI are separate architectural layers.
2. Business logic must not depend on a specific viewer engine.
3. Viewer types are interchangeable through a common Viewer Adapter contract.
4. All business/domain data is API-driven, even when the current source is local mock data.
5. UI components must never import mock JSON as a production data pattern.
6. Mock repositories/services must be replaceable by real HTTP/API implementations without rewriting presentation components.
7. Authentication, authorization, and RBAC are centralized concerns.
8. Do not scatter role checks such as `user.role === 'admin'` across the UI; use permissions/capabilities.
9. Client, Sales Agent, Sales Manager, Admin, and Super Admin are experiences within one platform—not five duplicated applications.
10. Responsive behavior must preserve route, viewer, navigation, and selection state.
11. Mobile is not a shrunken desktop layout; interaction patterns must adapt intentionally.
12. URL state and application navigation state should remain synchronized where practical.
13. Viewer libraries must be lazy-loaded/dynamically imported.
14. Performance is a product feature.
15. Accessibility and reduced-motion behavior are required.
16. No major feature is complete without loading, empty, error, and permission-denied states.
17. Avoid premature microservices. Begin with a clean modular architecture and explicit contracts.
18. Avoid irreversible architectural coupling during prototype/MVP work.
19. Security-sensitive behavior must never rely only on client-side checks.
20. Documentation must evolve when architecture decisions change.

## Core Product UX Rules

- The fullscreen visual experience is the hero.
- The client experience must remain elegant, calm, simple, premium, and easy to understand.
- Guest users must be able to explore without mandatory authentication.
- Authentication should become valuable when users want to save, compare, track interests, continue later, or manage enquiries.
- Breadcrumb sits directly under the main top bar, aligned to the left on desktop.
- Navigation must clearly communicate: Where am I? What am I looking at? What can I do? How do I go back?
- Avoid generic SaaS/dashboard visual language in the immersive client experience.
- Admin/operational surfaces may be denser, but should remain visually related to the same design system.

## Product Quality Bar

The product must be credible for review by:

- CTO / CIO
- VP Engineering
- Principal Architect
- Head of Product
- Product Design Director
- Creative Director
- Sales Leadership
- Enterprise Security
- Platform/Cloud Engineering

Do not produce a generic AI-generated website, dashboard template, or disconnected proof of concept.

## Working Method

Before major changes:

1. Inspect the repository and current implementation.
2. Understand existing dependencies, routes, styles, state, APIs, viewer code, and deployment assumptions.
3. State the current architecture briefly.
4. Identify what can be reused.
5. Identify architectural risks or conflicts.
6. Classify the requested work as Prototype, MVP, Production, or Enterprise concern.
7. Propose the minimum architecture that satisfies the current level without blocking reasonable future evolution.
8. Implement incrementally.
9. Keep the app runnable after each major stage.
10. Run type checks, linting, tests, and build checks where available.
11. Review UX, accessibility, performance, security boundaries, and failure states.
12. Update documentation if the implementation changes important contracts.

## Decision Format

For material architectural/product decisions, document:

```text
Decision
Why now
Alternatives considered
Trade-offs
Prototype/MVP impact
Production impact
Future evolution path
```

Do not write unnecessary ADRs for trivial changes.

## Definition of Done

A feature is not complete merely because it renders.

At minimum consider:

- correct user journey
- permissions
- responsive behavior
- keyboard/touch behavior
- loading state
- empty state
- error state
- API contract
- analytics event if meaningful
- tests where valuable
- performance impact
- accessibility
- security boundary
- documentation impact

## First Principle

Build a **next-generation immersive real-estate platform**, not merely an interactive viewer.
