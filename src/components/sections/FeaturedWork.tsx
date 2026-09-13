"use client";

import { useRef } from "react";
import Image from "next/image";
import { useReveal } from "@/hooks/useReveal";
import ScrubCanvas from "@/components/ScrubCanvas";
import { featuredWork, videoSlots } from "@/data/images";

/**
 * Featured Work reel. Scrubs forward/back as the reel block passes
 * through the viewport — it never plays on its own. `videoSlots.
 * featuredReel.src` is null until a real clip is supplied (see
 * VIDEO_PROMPTS.md) — the poster still carries the section until then.
 */
export default function FeaturedWork() {
  const rootRef = useReveal<HTMLDivElement>("[data-reveal]", { stagger: 0.08 });
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const reel = videoSlots.featuredReel;

  return (
    <section id="work" ref={rootRef} className="relative bg-bg py-28 md:py-44">
      <div className="px-6 md:px-16 mb-16" data-reveal>
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">04 — Featured Work</p>
        <h2 className="font-display italic text-3xl md:text-6xl max-w-2xl">
          Selected frames from the last few years.
        </h2>
      </div>

      {/* No data-reveal here: this block gets pinned, and an opacity tween
          on a pin target fights the pin-spacer. */}
      <div
        ref={videoWrapRef}
        className="relative mb-16 md:mb-24 mx-6 md:mx-16 aspect-video overflow-hidden rounded-sm"
      >
        {reel.sequence ? (
          <ScrubCanvas
            sequence={reel.sequence}
            triggerRef={videoWrapRef}
            pin
            pinLength="+=130%"
            className="w-full h-full"
          />
        ) : (
          <Image src={reel.poster} alt="Featured work reel" fill className="object-cover" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 px-6 md:px-16">
        {featuredWork.map((image, i) => (
          <div
            key={image.id}
            data-reveal
            className={`relative img-blend overflow-hidden aspect-[3/4] ${
              i === 0 ? "md:col-span-2 md:row-span-2 aspect-[4/3]" : ""
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="33vw"
              data-cursor-hover
            />
          </div>
        ))}
      </div>
    </section>
  );
}
