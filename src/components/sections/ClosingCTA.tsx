"use client";

import Image from "next/image";
import { useReveal } from "@/hooks/useReveal";
import ScrubCanvas from "@/components/ScrubCanvas";
import { videoSlots } from "@/data/images";
import { studio } from "@/data/studio";

/**
 * Backdrop scrubs forward/back with scroll rather than playing on its own,
 * and runs at full brightness with no scrim over it — the footage is the
 * point of this section. Legibility comes from drop shadows on the type
 * rather than from dimming the picture.
 */
export default function ClosingCTA() {
  const rootRef = useReveal<HTMLDivElement>();
  const backdrop = videoSlots.closingBackdrop;

  return (
    <section id="contact" ref={rootRef} className="relative bg-bg py-36 md:py-56 overflow-hidden">
      <div className="absolute inset-0">
        {backdrop.sequence ? (
          <ScrubCanvas
            sequence={backdrop.sequence}
            triggerRef={rootRef}
            pin
            pinLength="+=130%"
            className="w-full h-full"
          />
        ) : (
          <Image src={backdrop.poster} alt="" fill className="object-cover" sizes="100vw" />
        )}
      </div>

      <div className="relative z-10 text-center px-6" data-reveal>
        <h2 className="font-display italic text-[10vw] md:text-6xl leading-[1.05] max-w-4xl mx-auto drop-shadow-[0_2px_24px_rgba(0,0,0,0.95)]">
          Let&rsquo;s make something worth remembering.
        </h2>
        <a
          href={`mailto:${studio.email}`}
          className="inline-block mt-10 border border-fg/40 bg-black/35 px-8 py-4 rounded-full text-sm tracking-[0.2em] uppercase hover:border-accent hover:text-accent transition-colors duration-300 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
          data-cursor-hover
        >
          Start an inquiry
        </a>
      </div>
    </section>
  );
}
