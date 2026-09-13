"use client";

import { ReactNode, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis wired into GSAP's ticker so ScrollTrigger and Lenis share one
 * clock. Disabled under prefers-reduced-motion — native scroll takes over.
 *
 * Also owns refresh: every trigger measures start/end at creation time,
 * but ~20 remote images land afterwards and move everything down the page.
 * Without a refresh once they settle, every pin and scrub is anchored to
 * a layout that no longer exists.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // A reload restores the old scroll position on top of a fresh loader
    // and half-initialised triggers. Always start at the top.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const refresh = () => ScrollTrigger.refresh();

    // Re-measure as the page actually settles: after hydration, after fonts,
    // after every image finishes decoding, and once more on full load.
    const timers = [
      window.setTimeout(refresh, 200),
      window.setTimeout(refresh, 1200),
    ];

    document.fonts?.ready.then(refresh).catch(() => {});

    const pending = Array.from(document.images).filter((img) => !img.complete);
    if (pending.length) {
      let left = pending.length;
      const done = () => {
        if (--left === 0) refresh();
      };
      pending.forEach((img) => {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    }

    window.addEventListener("load", refresh);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", refresh);
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
