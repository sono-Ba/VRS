# Client Experience

## Principle

The client experience must remain elegant, simple, visual, and low-friction.

Core philosophy:

```text
Explore freely.
Sign in when you want to remember something.
```

Do not force authentication before exploration.

## Guest Capabilities

Guests may:

- explore cities, districts, projects, buildings, floors, units
- enter immersive experiences
- view public project/unit information
- view floor plans and galleries
- use temporary comparison
- share projects/units
- submit an enquiry or callback request

## Authentication Value

Prompt login when persistence is useful, for example:

- Save Project
- Save Unit
- Track Interest
- Persistent Compare
- Shortlist
- Save Search
- Continue Later

The prompt must be lightweight and dismissible.

## Authenticated Client Navigation

```text
Explore
Saved
Compare
My Interests
Enquiries
Recently Viewed
Profile
```

Avoid dashboard-heavy UX.

## Saved Projects

API-compatible operations:

```text
GET    /api/me/saved-projects
POST   /api/me/saved-projects
DELETE /api/me/saved-projects/:projectId
```

## Saved Units

```text
GET    /api/me/saved-units
POST   /api/me/saved-units
DELETE /api/me/saved-units/:unitId
```

## Compare Units

Support approximately 2–4 units per comparison session.

Compare meaningful attributes such as:

- project
- building
- floor
- bedrooms
- bathrooms
- area
- balcony area
- price
- price per area
- view
- availability
- floor plan
- orientation/features

Desktop: refined side-by-side comparison.
Mobile: horizontally navigable comparison with sticky labels where useful.

## Compare Projects

Support project comparison for attributes such as:

- location
- starting price
- handover
- bedroom range
- project status
- major amenities
- lifestyle positioning

## Client Interest

Saving is not equivalent to purchase intent.

Suggested interest levels:

```ts
type InterestLevel =
  | 'viewed'
  | 'saved'
  | 'interested'
  | 'high_interest'
  | 'enquired';
```

Do not infer sensitive or high-stakes conclusions from behavioral events.

## Recently Viewed / Continue Journey

Persist enough state to let the client return to approximately the same place:

```text
City → District → Project → Building → Floor → Unit
```

Provide a tasteful "Continue exploring" entry point rather than forcing restoration.

## Client Shortlists

Allow clients to group units into named shortlists later if the MVP scope supports it.

## Enquiries

Enquiry may target:

- Project
- Unit
- General request

This becomes the bridge to Lead/Sales workflows.

## Client ↔ Sales Context

If policy and consent allow, a sales agent may later see useful context such as saved/compared entities and enquiry source.

Never expose data beyond the permissions and privacy policy.
