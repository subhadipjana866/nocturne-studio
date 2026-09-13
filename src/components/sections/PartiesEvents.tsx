"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { eventGallery } from "@/data/images";
import { services } from "@/data/studio";

gsap.registerPlugin(ScrollTrigger);

/** Cascading overlap reveal — cards settle into place from behind as they enter view. */
export default function PartiesEvents() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        if (reduced) {
          gsap.set(el, { opacity: 1, scale: 1, rotate: 0, y: 0 });
          return;
        }
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.86, rotate: i % 2 === 0 ? -6 : 6, y: 60 },
          {
            opacity: 1,
            scale: 1,
            rotate: i % 2 === 0 ? -2 : 2,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const label = services.find((s) => s.id === "events");

  return (
    <section id="events" ref={sectionRef} className="relative bg-bg py-28 md:py-44">
      <div className="px-6 md:px-16 mb-16">
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">03 — Parties &amp; Events</p>
        <h2 className="font-display italic text-3xl md:text-6xl max-w-2xl">{label?.description}</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 px-6 md:px-16">
        {eventGallery.map((image, i) => (
          <div
            key={image.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`relative img-blend overflow-hidden ${
              i % 2 === 0
                ? "w-[72vw] md:w-[30vw] h-[46vh] md:h-[50vh]"
                : "w-[58vw] md:w-[22vw] h-[36vh] md:h-[38vh] md:mt-24"
            }`}
          >
            <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="30vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
