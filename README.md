# VRS — Immersive Real-Estate Platform

A premium immersive exploration and sales platform: continuous navigation from
city to district to project to building to floor to a single residence, with
role-aware tools around a shared viewer.

Built to the specification in [`CLAUDE.md`](CLAUDE.md) and [`docs/`](docs).
Start with [`docs/ASSESSMENT.md`](docs/ASSESSMENT.md) for current state,
decisions, and gaps.

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

## Trying the roles

Sign-in is at `/signin`. It offers five demo identities — Client, Sales Agent,
Sales Manager, Admin, Super Admin — so each role's experience can be reviewed.

> **This is not authentication.** The session cookie holds a plain account id
> with no signature or verification. It exists to demonstrate the permission
> model and must be replaced before any non-demo deployment. See
> [`docs/SECURITY-PRIVACY.md`](docs/SECURITY-PRIVACY.md).

Exploration never requires an account. Signing in adds saving, persistent
comparison, interests, and journey resume.

## Architecture at a glance

```text
src/
  app/            routes + local API (23 handlers under /api)
  application/    use cases (context resolution, deep links)
  auth/           permissions, session, demo accounts
  components/     layout · navigation · responsive · client · ui
  config/         the only place process.env is read
  domain/         City · District · Project · Building · Floor · Unit · User · …
  data/mock/      mock catalog — imported only by mock repositories
  repositories/   interfaces → mock | http implementations
  services/       API contract + client, analytics facade
  stores/         session · saved · compare
  viewers/        core contract + registry → panzoom | image adapters
```

Four boundaries carry most of the design:

- **Repositories.** UI never imports mock data. `NEXT_PUBLIC_DATA_SOURCE=api`
  switches the whole application onto HTTP repositories with no other change.
- **Permissions.** One `can(user, permission)` check, enforced independently in
  every API route. UI visibility is never the security boundary.
- **Viewers.** The application depends on the `ViewerAdapter` contract, never on
  a rendering engine. Adapters load dynamically.
- **Responsive presentation.** Desktop rail, tablet panel, and mobile bottom
  sheet render the same contextual content; route, selection, and viewer state
  live outside layout, so resizing or rotating never resets where you are.

## Governance package

`CLAUDE.md`, `START-HERE-PROMPT.md`, `docs/`, and `.claude/skills/` define the
operating perspective, architecture principles, and quality bar this codebase is
held to. Update the docs when a decision changes.
