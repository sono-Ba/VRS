# Architecture Review Skill

When reviewing architecture, evaluate the change from Product, Engineering, Security, Operations, and Evolution perspectives.

Return:

1. What problem the architecture solves
2. Current coupling and boundaries
3. Risks
4. Prototype/MVP suitability
5. Production suitability
6. Simpler alternatives
7. Recommended decision
8. Migration/evolution path

Check especially:

- UI ↔ viewer coupling
- UI ↔ data-source coupling
- repository/service boundaries
- state ownership
- authorization boundaries
- module boundaries
- lazy loading
- failure isolation
- testability
