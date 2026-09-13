"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { studio } from "@/data/studio";

/**
 * Premium loading screen: brand mark reveal + thin progress line, then a
 * mask wipe off-screen. Removes itself from the DOM once complete so it
 * costs nothing after first paint.
 */
export default function Loader({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(false);
      onDone?.();
      return;
    }

    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar) return;

    // Nothing should scroll underneath the loader — a scroll during the
    // intro leaves every pinned section starting mid-animation.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      document.body.style.overflow = previousOverflow;
      // Next's router owns history.scrollRestoration, so a mid-page reload
      // can restore scroll behind the loader. Land at the top regardless —
      // the pinned film has no meaningful entry point other than its start.
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
      setVisible(false);
      onDone?.();
    };

    const tl = gsap.timeline({ onComplete: finish });

    tl.set(bar, { scaleX: 0, transformOrigin: "left center" })
      .to(".loader-mark span", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
      })
      .to(bar, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, "+=0.1")
      .to(".loader-mark", { opacity: 0, duration: 0.4 }, "+=0.15")
      .to(root, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.05");

    // The timeline runs on rAF, which is throttled in a backgrounded tab.
    // Without a timer-based escape hatch the page would stay locked behind
    // the loader until the tab is focused.
    const safety = window.setTimeout(finish, 4500);

    return () => {
      window.clearTimeout(safety);
      document.body.style.overflow = previousOverflow;
      tl.kill();
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
      aria-hidden="true"
    >
      <div className="loader-mark flex overflow-hidden text-sm tracking-[0.35em] text-fg-dim">
        {studio.name.split("").map((c, i) => (
          <span key={i} className="inline-block translate-y-3 opacity-0">
            {c}
          </span>
        ))}
      </div>
      <div className="mt-6 h-px w-40 bg-line overflow-hidden">
        <div ref={barRef} className="h-full w-full bg-accent" />
      </div>
    </div>
  );
}
