# User Journeys

## Shared Immersive Journey

```text
Entry
→ City
→ District
→ Project
→ Project Preview
→ Project Details OR Enter Experience
→ Building
→ Floor
→ Unit
→ Contextual Action
```

The viewer is shared. Role-aware capabilities appear around it.

## Client / Guest

```text
Open application
→ Explore freely
→ City
→ District
→ Project
→ Experience
→ Unit
→ View details
→ Save / Compare / Enquire
→ Sign in only when persistence adds value
```

## Authenticated Client

```text
Sign in
→ Continue previous journey OR Explore
→ Saved Projects / Units / Interests
→ Compare
→ Enquire
→ Track activity
→ Return later and resume
```

## Sales Agent

```text
Login
→ Sales Home
→ Search/Create Client
→ Start Sales Session
→ Explore with Client
→ Shortlist / Compare / Add Note
→ Create Enquiry / Lead action
→ Save Session
→ Follow Up
```

## Sales Manager

```text
Login
→ Team Overview
→ Leads / Agent Activity / Project Demand
→ Inspect Client or Sales Session
→ Reassign / Review
→ Enter Immersive Experience when needed
```

## Admin

```text
Login
→ Content / Inventory / Users / Viewer Configuration
→ Manage entities
→ Validate publication state
→ Preview in immersive experience
```

## Super Admin

```text
Login
→ Organizations / Roles / Permissions / Integrations / System
→ Configure platform governance
→ Audit and diagnose
```

## Journey State

Important spatial state:

- cityId
- districtId
- projectId
- experienceId
- buildingId
- floorId
- unitId
- viewer type
- optional viewer camera/zoom state

Responsive changes must not reset this hierarchy.
