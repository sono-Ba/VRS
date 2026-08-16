# Viewer System

## Goal

Treat every visual technology as a replaceable viewer capability behind a shared contract.

## Viewer Types

- Deep Zoom Image
- Standard Image
- Video
- Looping Video
- Timestamp Video
- 360 Panorama
- Parallax
- Three.js / WebGL
- Gaussian Splat
- Map
- Pixel Streaming

## Contract

Illustrative contract:

```ts
interface ViewerAdapter {
  id: string;
  mount(container: HTMLElement): Promise<void>;
  load(config: ViewerConfig): Promise<void>;
  destroy(): void;
  focus?(target: ViewerTarget): Promise<void>;
  reset?(): Promise<void>;
  zoomTo?(target: ViewerTarget): Promise<void>;
  setCamera?(camera: CameraState): void;
  highlight?(targetId: string): void;
  clearHighlight?(): void;
  on(event: ViewerEvent, callback: ViewerEventHandler): void;
  off(event: ViewerEvent, callback: ViewerEventHandler): void;
}
```

Exact interfaces may evolve after repository inspection.

## Core Components

```text
ViewerShell
ViewerController
ViewerRegistry
ViewerAdapter
ViewerTransitionManager
ViewerEventBridge
ViewerPreloader
```

## Registry

Viewers must be loaded dynamically.

Do not load Three.js, splat, or Pixel Streaming code on routes that do not need them.

## Deep Zoom

Use tiled pyramids such as DZI/equivalent for massive masterplan imagery.

Support:

- pan
- zoom
- inertia
- hotspots
- polygon/region overlays
- zoom-aware labels
- focus navigation

## Video / Timestamp Video

Support custom timeline-driven sections and viewer navigation events without coupling business state to DOM media internals.

## Three.js

Support optimized GLTF/GLB workflow, texture compression, LOD where justified, camera presets, selection/highlight, and progressive loading.

## Pixel Streaming

Pixel Streaming is optional, not foundational.

Communication should be bidirectional through an adapter/event bridge:

```text
HTML → select unit / camera / scene / highlight
Unreal → loaded / selected / camera changed / interaction complete
```

## Viewer Transitions

Transitions should feel spatial and intentional, not like unrelated page swaps.

Respect reduced-motion settings and avoid excessive transition duration.
