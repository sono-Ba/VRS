# API Architecture

## API-First Rule

Anything likely to come from a future real API must already be accessed through a service/repository abstraction.

Bad:

```ts
import units from '@/data/mock/units.json';
```

Preferred:

```ts
await unitService.getUnits(filters);
```

## Local API for Development

Build a local API that mimics production contracts.

Suggested areas:

```text
/api/auth
/api/me
/api/users
/api/cities
/api/districts
/api/projects
/api/experiences
/api/buildings
/api/floors
/api/units
/api/leads
/api/enquiries
/api/sales-sessions
/api/shortlists
/api/analytics
```

Client-specific:

```text
/api/me/saved-projects
/api/me/saved-units
/api/me/interests
/api/me/recently-viewed
/api/me/journey
/api/me/compare
/api/me/enquiries
/api/me/saved-searches
```

## Repository Boundary

Example:

```ts
interface ProjectRepository {
  getAll(query?: ProjectQuery): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  getByDistrict(districtId: string): Promise<Project[]>;
}
```

Implementations:

```text
MockProjectRepository
HttpProjectRepository
```

## Data Source Switching

Allow environment/config selection such as:

```text
DATA_SOURCE=mock
DATA_SOURCE=api
```

Do not expose environment configuration directly throughout UI components.

## API Response Shape

Use consistent success/error/meta contracts.

Do not over-engineer generic wrappers if the real backend contract later differs; keep adapters at the boundary.

## Real-Time Evolution

Prepare event contracts for inventory updates such as:

```text
unit.price_changed
unit.availability_changed
project.updated
```

Introduce realtime only when it solves an actual product need.

## Error Semantics

Differentiate at least:

- validation
- unauthenticated
- unauthorized
- not found
- conflict
- rate limit if relevant
- upstream unavailable
- unexpected server error

UI must map these to useful user states.
