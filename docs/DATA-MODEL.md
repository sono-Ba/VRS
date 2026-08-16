# Domain Data Model

## Core Hierarchy

```text
City
└── District
    └── Project
        └── Experience
            └── Building
                └── Floor
                    └── Unit
```

## User

```ts
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  organizationId?: string;
  teamId?: string;
  permissions: Permission[];
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}
```

## Unit

Preserve API-friendly fields and avoid presentation-specific names in the domain model.

```ts
interface Unit {
  id: string;
  unitCode: string;
  unitNumber: string;
  projectId: string;
  buildingId?: string;
  floorId?: string;
  floorNumber: number;
  unitType?: string;
  bedrooms?: number;
  bathrooms?: number;
  balconyArea?: number;
  netArea?: number;
  grossArea?: number;
  viewEN?: string;
  viewAR?: string;
  actualPrice?: number;
  availability?: string;
  unitPlanURL?: string;
  imageURL?: string;
}
```

## Saved Project / Unit

```ts
interface SavedProject {
  id: string;
  userId: string;
  projectId: string;
  createdAt: string;
}

interface SavedUnit {
  id: string;
  userId: string;
  projectId: string;
  unitId: string;
  createdAt: string;
}
```

## Client Interest

```ts
interface ClientInterest {
  id: string;
  userId: string;
  entityType: 'project' | 'unit';
  entityId: string;
  level: InterestLevel;
  createdAt: string;
  updatedAt: string;
}
```

## Enquiry

```ts
interface Enquiry {
  id: string;
  userId?: string;
  projectId?: string;
  unitId?: string;
  message?: string;
  status: 'submitted' | 'assigned' | 'contacted' | 'qualified' | 'closed';
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Sales Session

```ts
interface SalesSession {
  id: string;
  agentId: string;
  clientId?: string;
  startedAt: string;
  endedAt?: string;
  selectedProjectIds: string[];
  selectedUnitIds: string[];
  shortlistedUnitIds: string[];
  notes?: string[];
}
```

## Mock Data Quality

Mock datasets must be relationally consistent:

```text
cityId → districtId → projectId → buildingId → floorId → unitId
```

Do not generate disconnected random fixtures.
