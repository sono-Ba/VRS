# UI / UX / Responsive Design

## Visual Direction

The product must feel:

- premium
- architectural
- cinematic
- editorial
- minimal
- calm
- precise
- spatial
- contemporary

Avoid:

- generic SaaS cards
- dashboard styling in public/client areas
- excessive rounded rectangles
- excessive gradients
- neon/gaming UI
- gratuitous glassmorphism
- decorative motion that competes with content

## Breadcrumb Requirement

The breadcrumb must sit directly beneath the main top navigation bar and align to the left on desktop.

```text
TOP BAR
────────────────────────────────
Abu Dhabi / District / Project / Experience

FULLSCREEN VIEWER
```

Breadcrumb behavior:

- current level has stronger contrast
- parent levels remain interactive
- breadcrumb updates URL/application state
- when supported, parent selection also commands spatial viewer navigation
- mobile may collapse or shorten intermediate levels

## Responsive Principle

Mobile is not a scaled-down desktop.

Use shared business/viewer state with adaptive presentation.

```text
Shared Application State
       ↓
Desktop / Tablet / Mobile presentation patterns
       ↓
Shared Viewer Controller
```

## Desktop

Prioritize immersive viewport and precision interaction.

Patterns may include:

- floating project panel
- contextual side rail
- hover enhancements
- wheel zoom
- keyboard shortcuts

## Mobile

Patterns should include:

- bottom sheets
- drawers
- tap-first controls
- pinch/drag gestures
- larger touch targets
- compact breadcrumb/back hierarchy

No functionality may depend only on hover.

## Transformation

Responsive transitions must preserve context.

Example:

```text
Desktop floating panel
→ Tablet compact panel
→ Mobile bottom sheet
```

Do not reset the viewer/navigation when resizing or rotating the device.

## Suggested Breakpoint Tokens

Use centralized semantic tokens; refine after real layouts are tested.

```text
small mobile     <480
mobile           480–767
tablet portrait  768–1023
tablet landscape 1024–1279
desktop          1280–1599
large desktop    1600+
```

## Motion

Use restrained motion:

- fades
- mask/image reveals
- subtle translations
- controlled crossfades
- camera transitions

Respect `prefers-reduced-motion`.

## Client Account UX

Client account surfaces should remain visual and property-led:

- Continue Exploring
- Saved Projects
- Saved Units
- Compare
- Interests
- Enquiries
- Recently Viewed

Avoid enterprise charts/tables unless genuinely useful to the client.
