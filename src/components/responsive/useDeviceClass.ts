"use client";

import { useEffect, useState } from "react";
import { deviceClassForWidth, type DeviceClass } from "@/styles/breakpoints";

/**
 * Tracks the presentation mode. Only presentation reads this — navigation,
 * viewer, and selection state live outside React layout concerns, so a resize
 * or rotation changes how things are drawn without resetting where the user is.
 */
export function useDeviceClass(): DeviceClass {
  // Server render assumes desktop; the effect corrects on mount before paint.
  const [deviceClass, setDeviceClass] = useState<DeviceClass>("desktop");

  useEffect(() => {
    const update = () => setDeviceClass(deviceClassForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return deviceClass;
}
