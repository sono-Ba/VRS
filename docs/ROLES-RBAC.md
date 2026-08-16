# Roles and Authorization

## Roles

```ts
type UserRole =
  | 'client'
  | 'sales_agent'
  | 'sales_manager'
  | 'admin'
  | 'super_admin';
```

Roles are bundles of default permissions. UI and services should rely primarily on capabilities/permissions.

## Permission Examples

```ts
type Permission =
  | 'projects:view'
  | 'projects:manage'
  | 'units:view'
  | 'units:view_price'
  | 'units:view_internal_data'
  | 'units:reserve'
  | 'favorites:manage_own'
  | 'compare:manage_own'
  | 'interests:manage_own'
  | 'leads:create'
  | 'leads:view_own'
  | 'leads:view_team'
  | 'leads:view_all'
  | 'leads:manage'
  | 'sales_sessions:create'
  | 'sales_sessions:view_own'
  | 'sales_sessions:view_team'
  | 'users:view'
  | 'users:manage'
  | 'analytics:view_own'
  | 'analytics:view_team'
  | 'analytics:view_all'
  | 'content:manage'
  | 'inventory:manage'
  | 'roles:manage'
  | 'integrations:manage'
  | 'system:manage'
  | 'audit:view';
```

## Rules

- Centralize authorization.
- Use helpers such as `can(user, permission)`.
- Protect routes centrally.
- Protect server/API operations independently of UI visibility.
- Never rely on hidden buttons as a security boundary.

## Role Intent

### Client
Public/personal property journey only.

### Sales Agent
Client-facing sales tools, own leads, own sessions, richer unit context.

### Sales Manager
Team oversight, team leads, operational analytics, reassignment/review.

### Admin
Content, inventory, users/configuration appropriate to operations.

### Super Admin
Platform governance, organizations, roles, integrations, audit, system settings.

## One Platform

Do not duplicate the immersive application per role.

```text
Shared Immersive Platform
+ Permission-aware contextual tools
+ Dedicated operational routes where appropriate
```
