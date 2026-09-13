"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMediaFlags } from "@/hooks/useMediaFlags";

/**
 * Custom dot + trailing ring cursor. Desktop pointer devices only —
 * hidden via CSS on touch, and skipped entirely under reduced motion.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { isDesktop, reducedMotion, ready } = useMediaFlags();

  useEffect(() => {
    if (!ready || !isDesktop || reducedMotion) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const ringPos = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.set(dot, { x: mouse.x, y: mouse.y });
    };

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover]")) {
        ring.classList.add("is-active");
      }
    };
    const onOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover]")) {
        ring.classList.remove("is-active");
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    const tick = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
    };
    gsap.ticker.add(tick);

    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      gsap.ticker.remove(tick);
      document.body.style.cursor = "auto";
    };
  }, [ready, isDesktop, reducedMotion]);

  if (!ready || !isDesktop || reducedMotion) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
