import type { ReactNode } from "react";
import type { SceneConfig } from "@/viewers/core/types";
import { ViewerShell } from "@/viewers/core/ViewerShell";

/**
 * The immersive surface: a full-bleed viewer with contextual UI floating over
 * it. The viewer fills whatever space the shell chrome leaves.
 */
export function ExperienceStage({
  scene,
  children,
}: {
  scene: SceneConfig;
  children?: ReactNode;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <ViewerShell scene={scene} />
      <div className="pointer-events-none absolute inset-0">{children}</div>
    </div>
  );
}
