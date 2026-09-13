"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { weddingGallery } from "@/data/images";
import { services } from "@/data/studio";

gsap.registerPlugin(ScrollTrigger);

/** Pinned horizontal gallery: the track scrubs sideways as the page scrolls down. */
export default function WeddingStories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Measured on every refresh, never captured — the track's width moves
    // as images decode and on every resize.
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const label = services.find((s) => s.id === "weddings");

  return (
    <section id="weddings" ref={sectionRef} className="relative bg-bg">
      <div className="h-screen overflow-hidden flex flex-col">
        <div className="px-6 md:px-16 pt-24 pb-8 shrink-0">
          <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">01 — Weddings</p>
          <h2 className="font-display italic text-3xl md:text-6xl max-w-2xl">{label?.description}</h2>
        </div>
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-10 px-6 md:px-16 items-end flex-1 min-h-[220px] pb-16 will-change-transform"
        >
          {weddingGallery.map((image, i) => (
            <div
              key={image.id}
              className={`relative shrink-0 h-full img-blend-h ${
                i % 2 === 0 ? "w-[62vw] md:w-[36vw]" : "w-[48vw] md:w-[26vw]"
              }`}
            >
              <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="60vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
