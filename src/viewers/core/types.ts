/**
 * Viewer contract. The application UI depends only on these types —
 * never on a concrete viewer engine (Three.js, OpenSeadragon, …).
 */

export type ViewerType =
  | "panzoom"
  | "image"
  | "video"
  | "panorama"
  | "three"
  | "splat"
  | "map"
  | "pixel-streaming";

export interface SceneHotspot {
  id: string;
  label: string;
  sublabel?: string;
  /** Position as percentage of scene width/height (0–100). */
  x: number;
  y: number;
  /** App-level navigation target; the viewer treats this as opaque. */
  href?: string;
}

export interface SceneConfig {
  viewerType: ViewerType;
  /** Primary media source (image URL, video URL, model URL …). */
  src: string;
  /** Intrinsic aspect ratio of the scene media (width / height). */
  aspectRatio: number;
  hotspots?: SceneHotspot[];
  /** Optional initial camera/zoom state. */
  camera?: CameraState;
}

export interface CameraState {
  zoom: number;
  centerX: number;
  centerY: number;
}

export type ViewerEvent = "ready" | "select" | "camera" | "error";

export interface ViewerEventPayloads {
  ready: void;
  select: { hotspotId: string };
  camera: CameraState;
  error: { message: string };
}

export type ViewerEventHandler<E extends ViewerEvent = ViewerEvent> = (
  payload: ViewerEventPayloads[E]
) => void;

export interface ViewerAdapter {
  readonly id: string;
  readonly type: ViewerType;
  mount(container: HTMLElement): Promise<void>;
  load(config: SceneConfig): Promise<void>;
  destroy(): void;
  focus?(hotspotId: string): Promise<void>;
  reset?(): Promise<void>;
  setCamera?(camera: CameraState): void;
  getCamera?(): CameraState | null;
  highlight?(hotspotId: string): void;
  clearHighlight?(): void;
  on<E extends ViewerEvent>(event: E, handler: ViewerEventHandler<E>): void;
  off<E extends ViewerEvent>(event: E, handler: ViewerEventHandler<E>): void;
}

export type ViewerAdapterFactory = () => ViewerAdapter;
