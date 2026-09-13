"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { studio } from "@/data/studio";
import { HERO_LINES, lineOpacity } from "@/data/heroBeats";

/**
 * Typography layered over the hero. Reads the same scroll progress ref the
 * camera uses (via gsap.ticker, not React state) so the lines land exactly
 * in the text phases where the prints have cleared out.
 */
export default function HeroOverlay({ progressRef }: { progressRef: React.RefObject<number> }) {
  const title = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tick = () => {
      const t = progressRef.current ?? 0;

      if (title.current) {
        const o = 1 - gsap.utils.clamp(0, 1, (t - 0.02) / 0.08);
        title.current.style.opacity = String(o);
        title.current.style.transform = `translateY(${t * -90}px) scale(${1 - t * 0.1})`;
      }

      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        const o = lineOpacity(t, i);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 24}px)`;
        el.style.filter = `blur(${(1 - o) * 5}px)`;
      });

      if (cue.current) {
        cue.current.style.opacity = String(1 - gsap.utils.clamp(0, 1, t / 0.04));
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [progressRef]);

  const setLineRef = (i: number) => (el: HTMLDivElement | null) => {
    lineRefs.current[i] = el;
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
      <div ref={title}>
        <h1 className="font-display italic text-[17vw] md:text-[9vw] leading-[0.9] tracking-tightest text-fg">
          {studio.name}
        </h1>
        <p className="mt-5 text-[10px] md:text-xs tracking-[0.45em] text-fg-dim uppercase">
          {studio.location}
        </p>
      </div>

      <div ref={setLineRef(0)} className="absolute max-w-3xl opacity-0">
        <p className="font-display italic text-3xl md:text-6xl leading-[1.1] text-fg drop-shadow-[0_2px_30px_rgba(0,0,0,0.8)]">
          {HERO_LINES[0]}
        </p>
      </div>

      <div ref={setLineRef(1)} className="absolute max-w-4xl opacity-0">
        <p className="text-[10px] md:text-sm tracking-[0.5em] uppercase text-fg leading-loose drop-shadow-[0_2px_30px_rgba(0,0,0,0.8)]">
          {HERO_LINES[1]}
        </p>
      </div>

      <div ref={setLineRef(2)} className="absolute max-w-3xl opacity-0">
        <p className="font-display italic text-2xl md:text-5xl leading-[1.15] text-fg drop-shadow-[0_2px_30px_rgba(0,0,0,0.8)]">
          {HERO_LINES[2]}
        </p>
      </div>

      <div
        ref={cue}
        className="absolute bottom-10 flex flex-col items-center gap-3 text-fg-dim text-[10px] tracking-[0.4em] uppercase"
      >
        <span>Scroll</span>
        <span className="w-px h-12 bg-gradient-to-b from-line to-transparent" />
      </div>
    </div>
  );
}
