"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SceneConfig, ViewerAdapter } from "./types";
import { createViewer } from "./registry";

interface ViewerShellProps {
  scene: SceneConfig;
  /** Called when a hotspot without an href is selected. */
  onSelect?: (hotspotId: string) => void;
  className?: string;
}

type ViewerStatus = "loading" | "ready" | "error";

/**
 * Mounts the appropriate viewer adapter for a scene and bridges viewer
 * events back into application navigation. This is the only component
 * that touches the viewer engine layer.
 */
export function ViewerShell({ scene, onSelect, className }: ViewerShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<ViewerAdapter | null>(null);
  const [status, setStatus] = useState<ViewerStatus>("loading");
  const router = useRouter();

  const sceneRef = useRef(scene);
  sceneRef.current = scene;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let adapter: ViewerAdapter | null = null;

    setStatus("loading");

    (async () => {
      try {
        adapter = await createViewer(scene.viewerType);
        if (cancelled) {
          adapter.destroy();
          return;
        }
        adapterRef.current = adapter;
        adapter.on("select", ({ hotspotId }) => {
          const hotspot = sceneRef.current.hotspots?.find((h) => h.id === hotspotId);
          if (hotspot?.href) {
            router.push(hotspot.href);
          } else {
            onSelectRef.current?.(hotspotId);
          }
        });
        adapter.on("error", () => setStatus("error"));
        await adapter.mount(container);
        await adapter.load(scene);
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      adapter?.destroy();
      adapterRef.current = null;
    };
    // Recreate the viewer only when the scene itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.viewerType, scene.src, router]);

  return (
    <div className={`vrs-viewer-shell ${className ?? ""}`}>
      <div ref={containerRef} className="absolute inset-0" />
      {status === "loading" && (
        <div className="vrs-viewer-state" role="status" aria-label="Loading experience">
          <span className="vrs-loading-line" />
          <p>Preparing experience</p>
        </div>
      )}
      {status === "error" && (
        <div className="vrs-viewer-state" role="alert">
          <p className="text-sm tracking-wide">
            This experience could not be loaded.
          </p>
          <button
            type="button"
            className="vrs-btn-ghost mt-3"
            onClick={() => router.refresh()}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
