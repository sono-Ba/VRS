# Application Architecture

## Logical Layers

```text
Presentation / Routes / UI
        ↓
Application Use Cases
        ↓
State / Auth / Authorization
        ↓
Viewer Orchestration
        ↓
Domain Models
        ↓
Services / Repository Interfaces
        ↓
Mock API today / Real APIs later
```

## Core Separation

```text
HTML / React UI
        │
Application State + Use Cases
        │
Viewer Controller
        │
Viewer Adapter
        │
Concrete Viewer Engine
```

The UI must not directly depend on Three.js/OpenSeadragon/etc. for business logic.

## Recommended Frontend Foundation

Prefer, unless repository constraints dictate otherwise:

- Next.js
- React
- TypeScript strict mode
- Tailwind or equivalent token-driven styling
- Zustand or similarly lightweight client application state
- TanStack Query for remote/server state
- Framer Motion where motion materially improves UX

Do not introduce dependencies without a clear reason.

## Suggested Project Structure

```text
src/
  app/
  components/
    layout/
    navigation/
    responsive/
    project/
    unit/
    sales/
    admin/
  domain/
    city/
    district/
    project/
    building/
    floor/
    unit/
    user/
    lead/
    enquiry/
    sales-session/
  viewers/
    core/
    deepzoom/
    video/
    panorama/
    three/
    splat/
    map/
    pixel-streaming/
  auth/
  application/
  repositories/
    interfaces/
    mock/
    http/
  services/
    api/
    realtime/
    analytics/
  stores/
  config/
  styles/
  data/mock/
```

## Routing

Prefer semantic URLs such as:

```text
/abu-dhabi
/abu-dhabi/:district
/abu-dhabi/:district/:project
/abu-dhabi/:district/:project/experience
/.../building/:buildingId
/.../floor/:floorId
/.../unit/:unitId
```

Persist enough state in URLs to make reload/share useful, but do not over-encode ephemeral animation state.

## State Boundaries

Separate:

- server/remote state
- navigation/experience state
- viewer state
- auth/session state
- sales session state
- transient UI state

Avoid one giant store.

## Evolution Strategy

Prototype/MVP: modular monolith with explicit contracts.

Production: keep module boundaries, move only proven bottlenecks or ownership boundaries into separate services.

Enterprise: consider service decomposition, event architecture, or multi-tenant platform patterns only when justified by scale, compliance, ownership, or deployment needs.
