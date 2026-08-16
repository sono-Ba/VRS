import { ViewerEmitter } from "../core/emitter";
import type {
  CameraState,
  SceneConfig,
  SceneHotspot,
  ViewerAdapter,
  ViewerEvent,
  ViewerEventHandler,
} from "../core/types";

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

/**
 * Lightweight deep-zoom-style viewer: pan (drag), wheel zoom, pinch zoom,
 * and hotspot selection. Deliberately dependency-free for the prototype;
 * a tiled DZI engine (e.g. OpenSeadragon) can replace it behind the same
 * ViewerAdapter contract when real masterplan pyramids exist.
 */
export class PanZoomViewerAdapter implements ViewerAdapter {
  readonly id = "panzoom-basic";
  readonly type = "panzoom" as const;

  private emitter = new ViewerEmitter();
  private container: HTMLElement | null = null;
  private stage: HTMLDivElement | null = null;
  private content: HTMLDivElement | null = null;
  private config: SceneConfig | null = null;
  private camera: CameraState = { zoom: 1, centerX: 50, centerY: 50 };
  private highlighted: string | null = null;

  private dragging = false;
  private lastPointer: { x: number; y: number } | null = null;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinchDistance: number | null = null;
  private cleanupFns: Array<() => void> = [];

  async mount(container: HTMLElement): Promise<void> {
    this.container = container;
    const stage = document.createElement("div");
    stage.className = "vrs-panzoom-stage";
    stage.style.cssText =
      "position:absolute;inset:0;overflow:hidden;touch-action:none;cursor:grab;user-select:none;";
    container.appendChild(stage);
    this.stage = stage;
    this.bindEvents(stage);
  }

  async load(config: SceneConfig): Promise<void> {
    if (!this.stage) throw new Error("PanZoomViewerAdapter not mounted");
    this.config = config;
    this.camera = config.camera ?? { zoom: 1, centerX: 50, centerY: 50 };
    this.stage.innerHTML = "";

    const content = document.createElement("div");
    content.style.cssText =
      "position:absolute;inset:0;transform-origin:0 0;will-change:transform;";
    this.content = content;
    this.stage.appendChild(content);

    await this.loadImage(config.src, content);
    this.renderHotspots(config.hotspots ?? []);
    this.applyCamera();
    this.emitter.emit("ready", undefined);
  }

  private loadImage(src: string, content: HTMLDivElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      img.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;";
      img.onload = () => resolve();
      img.onerror = () => {
        this.emitter.emit("error", { message: `Failed to load scene media: ${src}` });
        reject(new Error(`Failed to load scene media: ${src}`));
      };
      content.appendChild(img);
    });
  }

  private renderHotspots(hotspots: SceneHotspot[]): void {
    if (!this.content) return;
    for (const hotspot of hotspots) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "vrs-hotspot";
      btn.dataset.hotspotId = hotspot.id;
      btn.setAttribute("aria-label", hotspot.label);
      btn.style.left = `${hotspot.x}%`;
      btn.style.top = `${hotspot.y}%`;
      btn.innerHTML = `<span class="vrs-hotspot-dot"></span><span class="vrs-hotspot-label">${hotspot.label}${
        hotspot.sublabel ? `<em>${hotspot.sublabel}</em>` : ""
      }</span>`;
      btn.addEventListener("click", () => {
        // Suppress selection when the gesture was a pan, not a tap.
        if (this.dragging) return;
        this.emitter.emit("select", { hotspotId: hotspot.id });
      });
      this.content.appendChild(btn);
    }
  }

  private bindEvents(stage: HTMLDivElement): void {
    /**
     * Drag tracking lives on `window` rather than using `setPointerCapture`:
     * capturing on the stage would redirect pointer events away from the
     * hotspot buttons inside it, so taps on a hotspot would never register.
     * Window listeners also keep a pan alive when the cursor leaves the stage.
     */
    const onPointerDown = (event: PointerEvent) => {
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (this.pointers.size === 1) {
        this.lastPointer = { x: event.clientX, y: event.clientY };
        this.dragging = false;
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!this.pointers.has(event.pointerId)) return;
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        if (!a || !b) return;
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (this.pinchDistance !== null && this.pinchDistance > 0) {
          this.zoomBy(distance / this.pinchDistance);
        }
        this.pinchDistance = distance;
        return;
      }

      if (this.lastPointer) {
        const dx = event.clientX - this.lastPointer.x;
        const dy = event.clientY - this.lastPointer.y;
        if (Math.abs(dx) + Math.abs(dy) > 2) this.dragging = true;
        this.panByPixels(dx, dy);
        this.lastPointer = { x: event.clientX, y: event.clientY };
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      this.pointers.delete(event.pointerId);
      if (this.pointers.size < 2) this.pinchDistance = null;
      if (this.pointers.size === 0) {
        this.lastPointer = null;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
        // The click event fires after pointerup; let the hotspot handler read
        // `dragging` before it is cleared.
        setTimeout(() => {
          this.dragging = false;
        }, 0);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      this.zoomBy(event.deltaY < 0 ? 1.12 : 1 / 1.12);
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("wheel", onWheel, { passive: false });

    this.cleanupFns.push(() => {
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    });
  }

  private panByPixels(dx: number, dy: number): void {
    if (!this.stage) return;
    const rect = this.stage.getBoundingClientRect();
    this.camera.centerX -= (dx / (rect.width * this.camera.zoom)) * 100;
    this.camera.centerY -= (dy / (rect.height * this.camera.zoom)) * 100;
    this.applyCamera();
  }

  private zoomBy(factor: number): void {
    this.camera.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.camera.zoom * factor));
    this.applyCamera();
  }

  private applyCamera(): void {
    if (!this.content || !this.stage) return;
    const { zoom } = this.camera;
    // Clamp the visible center so the scene always fills the stage.
    const half = 50 / zoom;
    this.camera.centerX = Math.min(100 - half, Math.max(half, this.camera.centerX));
    this.camera.centerY = Math.min(100 - half, Math.max(half, this.camera.centerY));

    const translateX = 50 - this.camera.centerX * zoom;
    const translateY = 50 - this.camera.centerY * zoom;
    this.content.style.transform = `translate(${translateX}%, ${translateY}%) scale(${zoom})`;
    this.emitter.emit("camera", { ...this.camera });
  }

  async focus(hotspotId: string): Promise<void> {
    const hotspot = this.config?.hotspots?.find((h) => h.id === hotspotId);
    if (!hotspot) return;
    this.camera = { zoom: Math.max(this.camera.zoom, 2), centerX: hotspot.x, centerY: hotspot.y };
    this.applyCamera();
  }

  async reset(): Promise<void> {
    this.camera = { zoom: 1, centerX: 50, centerY: 50 };
    this.applyCamera();
  }

  setCamera(camera: CameraState): void {
    this.camera = { ...camera };
    this.applyCamera();
  }

  getCamera(): CameraState | null {
    return { ...this.camera };
  }

  highlight(hotspotId: string): void {
    this.clearHighlight();
    const el = this.content?.querySelector<HTMLElement>(
      `[data-hotspot-id="${hotspotId}"]`
    );
    if (el) {
      el.classList.add("vrs-hotspot-active");
      this.highlighted = hotspotId;
    }
  }

  clearHighlight(): void {
    if (!this.highlighted) return;
    this.content
      ?.querySelector(`[data-hotspot-id="${this.highlighted}"]`)
      ?.classList.remove("vrs-hotspot-active");
    this.highlighted = null;
  }

  on<E extends ViewerEvent>(event: E, handler: ViewerEventHandler<E>): void {
    this.emitter.on(event, handler);
  }

  off<E extends ViewerEvent>(event: E, handler: ViewerEventHandler<E>): void {
    this.emitter.off(event, handler);
  }

  destroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    this.stage?.remove();
    this.stage = null;
    this.content = null;
    this.container = null;
    this.config = null;
    this.emitter.clear();
  }
}
