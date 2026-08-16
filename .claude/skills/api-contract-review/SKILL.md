# API Contract Review Skill

Review API/service/repository contracts for replacement-readiness.

Check:

- UI is not importing mock data directly
- API concerns are behind service/repository boundaries
- domain models are not polluted by presentation state
- error semantics are explicit
- auth/permissions are enforced at server boundary when applicable
- mock and HTTP implementations can share the same contract
- pagination/filtering/query semantics are coherent
- identifiers are consistent
- realtime events, if any, are versionable and justified

Avoid abstracting for abstraction's sake.
