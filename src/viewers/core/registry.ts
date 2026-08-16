import type { ViewerAdapter, ViewerType } from "./types";

/**
 * Viewer registry. Every adapter is loaded through a dynamic import so that
 * heavy engines (Three.js, splat, pixel streaming) never ship to routes that
 * do not use them. Unimplemented types fail loudly with a clear message.
 */
const loaders: Partial<Record<ViewerType, () => Promise<ViewerAdapter>>> = {
  panzoom: async () => {
    const { PanZoomViewerAdapter } = await import("../panzoom/PanZoomViewerAdapter");
    return new PanZoomViewerAdapter();
  },
  image: async () => {
    const { ImageViewerAdapter } = await import("../image/ImageViewerAdapter");
    return new ImageViewerAdapter();
  },
};

export function isViewerImplemented(type: ViewerType): boolean {
  return type in loaders;
}

export async function createViewer(type: ViewerType): Promise<ViewerAdapter> {
  const loader = loaders[type];
  if (!loader) {
    throw new Error(
      `Viewer type "${type}" is registered in the contract but has no adapter implementation yet.`
    );
  }
  return loader();
}
