# Implementation Plan

## Phase 0 — Repository Assessment

Before architecture changes:

- inspect framework and versions
- inspect routing
- inspect current UI shell
- inspect viewer implementations
- inspect state management
- inspect existing APIs/mocks
- inspect CSS/design system
- inspect authentication assumptions
- inspect build/deployment scripts
- identify reusable work

Output a concise Current State + Gaps + Proposed Changes summary.

## Phase 1 — Foundation

Implement or normalize:

- domain types
- repository interfaces
- service layer
- local/mock API
- consistent API errors
- auth abstraction
- roles/permissions
- route guards

Keep production replacement path explicit.

## Phase 2 — Responsive Application Shell

Implement:

- top navigation
- breadcrumb directly below top bar, left-aligned on desktop
- viewer shell
- responsive layout tokens
- mobile navigation
- desktop/tablet/mobile transformations
- state preservation on resize/orientation change

## Phase 3 — Core Immersive Journey

Implement vertical slice:

```text
City
→ District
→ Project
→ Project Preview
→ Enter Experience
```

Prefer Deep Zoom first for city/district if appropriate.

## Phase 4 — Viewer Architecture

Implement:

- ViewerAdapter
- ViewerRegistry
- ViewerController
- ViewerTransitionManager

Initial concrete viewers:

1. Deep Zoom
2. Video
3. Panorama
4. Three.js

Other viewers may begin as interfaces/placeholders.

## Phase 5 — Building / Floor / Unit

Add:

- inventory navigation
- unit detail
- availability
- unit plan
- URL synchronization
- loading/error/empty states

## Phase 6 — Client Personal Layer

Add:

- optional login
- saved projects
- saved units
- compare units/projects
- interests
- recently viewed
- continue journey
- enquiries

Keep the client experience visually simple.

## Phase 7 — Sales Agent

Add:

- client lookup/create
- sales session
- shortlist
- compare for client
- notes
- lead/enquiry context

## Phase 8 — Sales Manager

Add:

- team views
- team leads
- session review
- useful team analytics

## Phase 9 — Admin / Super Admin

Add only after domain/contracts are stable:

- content management
- inventory management
- users
- roles/permissions
- integrations/settings
- audit/system tools where justified

## Phase 10 — Production Hardening

When moving beyond prototype/MVP:

- real auth
- server authorization
- real APIs
- production persistence
- CI/CD
- monitoring
- security headers
- rate/abuse controls
- backup/recovery requirements
- auditability
- performance budgets
