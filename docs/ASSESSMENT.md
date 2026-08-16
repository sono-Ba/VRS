# Current State, Decisions, and Gaps

Written after the first implementation pass. Update this document when the
architecture changes.

## 1. Starting Point

The repository was empty apart from the governance package (`CLAUDE.md`,
`START-HERE-PROMPT.md`, `docs/`, `.claude/skills/`). There was no framework, no
routes, no viewer, and no data to preserve, so Phase 0 produced no reusable
work and no legacy constraints. Everything below was built from scratch against
the documented target architecture.

## 2. Current Architecture

```text
app/ (routes, API handlers)
  → application/   use cases: resolveContext, links
  → auth/          permissions, session, demo accounts
  → viewers/       ViewerShell → registry → adapter → engine
  → domain/        City · District · Project · Building · Floor · Unit · User · …
  → repositories/  interfaces → mock | http   (composition root: repositories/index.ts)
  → services/      api contract + fetch client, analytics facade
  → stores/        session · saved · compare
```

Key properties:

- **No UI component imports mock JSON.** `src/data/mock/catalog.ts` is imported
  only by `repositories/mock/*`. Pages call `application/catalog-service.ts`.
- **Data source is switchable.** `NEXT_PUBLIC_DATA_SOURCE=mock|api` selects mock
  or HTTP repositories in `repositories/index.ts`. Nothing above that file changes.
- **The API is real.** 23 route handlers under `/api` implement the documented
  contracts with a shared success/error envelope and typed error codes.
- **Authorization is centralized.** One `can(user, permission)` function; no
  `user.role === '...'` comparisons anywhere in the UI.
- **The viewer is isolated.** Only `ViewerShell` touches an adapter; adapters
  are dynamically imported, so no viewer engine ships to routes that skip it.

## 3. Material Decisions

### Deep zoom implemented as a dependency-free pan/zoom adapter

- **Decision.** Ship `PanZoomViewerAdapter` (pointer drag, wheel zoom, pinch,
  hotspots) instead of adding OpenSeadragon now.
- **Why now.** There are no DZI tile pyramids yet — only single SVG masterplans.
  A tiling engine would add a dependency that solves a problem we do not have.
- **Alternatives.** OpenSeadragon immediately; a `<canvas>` renderer.
- **Trade-offs.** No tile streaming, so genuinely huge imagery is not supported yet.
- **Prototype/MVP impact.** None — behaviour is identical at this asset size.
- **Production path.** Swap in an OpenSeadragon adapter behind the same
  `ViewerAdapter` contract and register it in `viewers/core/registry.ts`. No
  page, store, or component changes.

### Server-rendered catalog, client-side personal layer

- **Decision.** Pages resolve catalog data on the server; saves, compare, and
  journey run through client stores calling `/api/me/*`.
- **Why now.** Catalog data is shared and cacheable; personal data is per-user
  and must feel instant when a client taps Save mid-exploration.
- **Trade-offs.** Two data paths to understand.
- **Production path.** Unchanged. The client stores already speak HTTP.

### Comparison persists locally, saving requires an account

- **Decision.** Compare is available to guests via `localStorage`; Save is not.
- **Why now.** The documented philosophy is "explore freely, sign in to
  remember". Comparison is a session tool, not a stored preference.
- **Trade-offs.** A guest's comparison does not follow them to another device —
  which is exactly the moment the sign-in prompt earns its place.

### Panel collapse instead of viewer safe-area insets

- **Decision.** The contextual rail can be hidden, revealing the full masterplan.
- **Why now.** A floating rail necessarily covers part of a full-bleed drawing.
  Insetting the viewer would break the full-bleed hero; authoring every hotspot
  around the panel would couple content to layout.
- **Mitigation.** Nothing is reachable *only* by hotspot — every hotspot target
  also appears as a list item in the panel, which keeps the experience keyboard-
  and screen-reader-navigable.

## 4. What Is Built

| Area | State |
| --- | --- |
| City → District → Project → Building → Floor → Unit | Complete vertical slice, URL-addressable |
| Breadcrumb below top bar, left-aligned, parents navigable | Complete, collapses on mobile |
| Desktop rail → tablet panel → mobile bottom sheet | Complete, state preserved across breakpoints |
| RBAC across 5 roles / 28 capabilities | Complete, enforced server-side in API routes |
| Saved projects & units, compare, interests, recently viewed, journey resume | Complete |
| Enquiries (guest and authenticated) | Complete, with field-level validation |
| Sales / Manager / Admin / Super Admin surfaces | Read-only views over real data |
| Loading, empty, error, permission-denied states | Present on every route |

## 5. Gaps, by Delivery Level

**Prototype (none blocking).** The prototype goals are met.

**MVP**
- Sales sessions, client lookup, and shortlists are described but not persisted
  (`SalesSession` type exists; no repository yet).
- Admin surfaces are read-only; content and inventory editing needs write
  endpoints and an audit trail.
- No test suite. Highest-value first tests: `resolveContext` ancestry validation,
  `can()` permission matrix, and the price-scaling in the mock generator.
- Enquiry assignment and lead workflow are not implemented.

**Production**
- **Authentication is not real.** `auth/session.ts` reads an unsigned cookie
  containing a plain account id. It is trivially forgeable and is labelled as
  prototype-only in the code. This must be replaced before any deployment that
  is not a private demo.
- The mock store is in-memory and resets on server restart.
- No CI, no error reporting sink, no security headers or CSP.
- Performance budgets are unmeasured; only lazy-loading is in place.

**Enterprise**
- Multi-tenancy, SSO/SCIM, data residency, and formal audit are not started —
  correctly, since nothing yet justifies them.

## 6. Recommended Next Sequence

1. Tests for `resolveContext`, `can()`, and the API error contract.
2. Real authentication and server-side session validation.
3. Persistence behind the existing repository interfaces (the swap point already exists).
4. Sales sessions and shortlists — the largest documented gap in the sales journey.
5. Admin write paths with audit logging.
6. OpenSeadragon adapter once real tile pyramids exist.
7. CI running typecheck, lint, test, and build on every pull request.
