# Delivery and Engineering Quality

## Engineering Standards

- strict TypeScript
- cohesive modules
- small responsibility-focused components
- clear interfaces
- no hidden global mutable state
- no giant `useEffect` orchestration blocks where a better abstraction is practical
- avoid magic constants
- consistent design tokens
- predictable error handling

## Testing Strategy

Choose tests based on risk.

Prototype:
- typecheck
- lint
- a few critical unit/integration tests
- smoke test core journey

MVP/Production:
- unit tests for domain/use cases
- API contract tests
- integration tests for repositories/services
- component tests where valuable
- end-to-end tests for core journeys
- responsive/device testing
- accessibility checks

## CI/CD Evolution

Prototype:
- local quality scripts

MVP:
- automated lint/type/test/build on pull requests
- preview environment

Production:
- deployment pipeline
- environment promotion
- migrations/config validation
- rollback strategy
- release monitoring

## Performance Budgets

Treat as explicit targets after baseline measurement.

Focus first on:

- initial JS payload
- viewer library lazy-loading
- asset size
- image/video delivery
- deep-zoom tiling
- 3D texture/model optimization
- route transitions
- mobile memory/GPU constraints

## Review Gate

Before declaring a major feature complete, review:

- business outcome
- UX clarity
- architecture fit
- permission model
- API contract
- responsiveness
- accessibility
- errors/loading
- performance
- security boundary
- test coverage appropriate to risk
