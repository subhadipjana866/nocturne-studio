"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { portraitGallery } from "@/data/images";
import { services } from "@/data/studio";

gsap.registerPlugin(ScrollTrigger);

const speeds = [0.08, -0.06, 0.12, -0.1, 0.07, -0.08];

/** Layered parallax grid — each tile drifts at its own rate as the section passes. */
export default function Portraits() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          yPercent: speeds[i % speeds.length] * 100,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const label = services.find((s) => s.id === "portraits");

  return (
    <section id="portraits" ref={sectionRef} className="relative bg-bg py-28 md:py-44 overflow-hidden">
      <div className="px-6 md:px-16 mb-16">
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">02 — Portraits</p>
        <h2 className="font-display italic text-3xl md:text-6xl max-w-2xl">{label?.description}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 px-6 md:px-16">
        {portraitGallery.map((image, i) => (
          <div
            key={image.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`relative img-blend overflow-hidden aspect-[4/5] ${
              i % 3 === 1 ? "mt-16 md:mt-28" : i % 3 === 2 ? "mt-4 md:mt-8" : ""
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="33vw"
              data-cursor-hover
            />
          </div>
        ))}
      </div>
    </section>
  );
}
