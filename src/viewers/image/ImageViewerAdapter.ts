import { ViewerEmitter } from "../core/emitter";
import type {
  SceneConfig,
  ViewerAdapter,
  ViewerEvent,
  ViewerEventHandler,
} from "../core/types";

/** Static image scene (e.g. a unit plan) with optional hotspots. */
export class ImageViewerAdapter implements ViewerAdapter {
  readonly id = "image-basic";
  readonly type = "image" as const;

  private emitter = new ViewerEmitter();
  private root: HTMLDivElement | null = null;

  async mount(container: HTMLElement): Promise<void> {
    const root = document.createElement("div");
    root.style.cssText = "position:absolute;inset:0;overflow:hidden;";
    container.appendChild(root);
    this.root = root;
  }

  async load(config: SceneConfig): Promise<void> {
    if (!this.root) throw new Error("ImageViewerAdapter not mounted");
    this.root.innerHTML = "";
    await new Promise<void>((resolve, reject) => {
      const img = document.createElement("img");
      img.src = config.src;
      img.alt = "";
      img.draggable = false;
      img.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;object-fit:contain;";
      img.onload = () => resolve();
      img.onerror = () => {
        this.emitter.emit("error", { message: `Failed to load image: ${config.src}` });
        reject(new Error(`Failed to load image: ${config.src}`));
      };
      this.root!.appendChild(img);
    });
    this.emitter.emit("ready", undefined);
  }

  on<E extends ViewerEvent>(event: E, handler: ViewerEventHandler<E>): void {
    this.emitter.on(event, handler);
  }

  off<E extends ViewerEvent>(event: E, handler: ViewerEventHandler<E>): void {
    this.emitter.off(event, handler);
  }

  destroy(): void {
    this.root?.remove();
    this.root = null;
    this.emitter.clear();
  }
}
