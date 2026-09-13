"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade + rise reveal for non-pinned brand sections. Not a scrub timeline —
 * one ScrollTrigger per element, toggled once it crosses the viewport.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  selector = "[data-reveal]",
  options?: { y?: number; stagger?: number }
) {
  const root = useRef<T>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = el.querySelectorAll<HTMLElement>(selector);
    if (targets.length === 0) return;

    if (reduced) {
      targets.forEach((t) => {
        t.style.opacity = "1";
        t.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: options?.y ?? 28 });
      targets.forEach((target, i) => {
        gsap.to(target, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: (options?.stagger ?? 0) * i,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, el);

    // Fail-safe: these elements start at opacity 0, so a trigger that never
    // fires leaves a permanent blank block on the page. Anything still
    // invisible while on screen gets shown regardless.
    const rescue = window.setTimeout(() => {
      targets.forEach((target) => {
        const box = target.getBoundingClientRect();
        const onScreen = box.top < window.innerHeight && box.bottom > 0;
        if (onScreen && Number(getComputedStyle(target).opacity) === 0) {
          gsap.set(target, { opacity: 1, y: 0 });
        }
      });
    }, 2500);

    return () => {
      window.clearTimeout(rescue);
      ctx.revert();
    };
  }, [selector, options?.y, options?.stagger]);

  return root;
}
