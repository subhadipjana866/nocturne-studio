"use client";

import { useEffect, useState } from "react";

/**
 * Shared environment flags so sections can dial down effects on mobile
 * and honor prefers-reduced-motion without duplicating listeners.
 */
export function useMediaFlags() {
  const [flags, setFlags] = useState({
    isDesktop: true,
    reducedMotion: false,
    ready: false,
  });

  useEffect(() => {
    const desktopMq = window.matchMedia("(min-width: 1024px) and (hover: hover)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () =>
      setFlags({
        isDesktop: desktopMq.matches,
        reducedMotion: motionMq.matches,
        ready: true,
      });

    update();
    desktopMq.addEventListener("change", update);
    motionMq.addEventListener("change", update);
    return () => {
      desktopMq.removeEventListener("change", update);
      motionMq.removeEventListener("change", update);
    };
  }, []);

  return flags;
}
