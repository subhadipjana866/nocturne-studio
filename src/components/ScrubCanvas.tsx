"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFrameSequence } from "@/hooks/useFrameSequence";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  /** folder name under public/frames/ */
  sequence: string;
  className?: string;
  /** drive from a progress ref another section already maintains */
  progressRef?: React.RefObject<number>;
  /** or scrub against this element's own trip through the viewport */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /**
   * Hold the page in place while the sequence plays. The trigger pins at
   * the top of the viewport and every frame is scrubbed across `pinLength`
   * of scrolling before the page continues.
   */
  pin?: boolean;
  /** scroll distance the pin lasts for, GSAP end syntax */
  pinLength?: string;
};

/**
 * A scroll-scrubbed frame sequence on a canvas — the replacement for
 * scroll-scrubbing a <video>, which stutters badly on clips with sparse
 * keyframes (see useFrameSequence).
 */
export default function ScrubCanvas({
  sequence,
  className,
  progressRef,
  triggerRef,
  pin = false,
  pinLength = "+=120%",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ready, draw } = useFrameSequence(sequence);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Always paint something immediately so the slot is never an empty
    // black rectangle waiting on the first scroll event.
    const initial = progressRef ? (progressRef.current ?? 0) : 0;
    drawRef.current(canvas, reduced ? 0.5 : initial);

    const onResize = () => drawRef.current(canvas, lastProgress.current);
    const lastProgress = { current: reduced ? 0.5 : initial };
    window.addEventListener("resize", onResize);

    if (reduced) {
      return () => window.removeEventListener("resize", onResize);
    }

    let cleanupScrub: () => void;

    if (progressRef) {
      const tick = () => {
        const p = progressRef.current ?? 0;
        lastProgress.current = p;
        drawRef.current(canvas, p);
      };
      gsap.ticker.add(tick);
      cleanupScrub = () => gsap.ticker.remove(tick);
    } else {
      const st = ScrollTrigger.create({
        trigger: triggerRef?.current ?? canvas,
        // Pinned: hold at the top and play every frame out before the page
        // is allowed to continue. Unpinned: scrub as it crosses the view.
        start: pin ? "top top" : "top bottom",
        end: pin ? pinLength : "bottom top",
        pin: pin ? (triggerRef?.current ?? canvas) : false,
        anticipatePin: pin ? 1 : 0,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          lastProgress.current = self.progress;
          drawRef.current(canvas, self.progress);
        },
      });
      cleanupScrub = () => st.kill();
    }

    return () => {
      window.removeEventListener("resize", onResize);
      cleanupScrub();
    };
  }, [ready, progressRef, triggerRef, pin, pinLength]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
