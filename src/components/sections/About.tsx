"use client";

import Image from "next/image";
import { useReveal } from "@/hooks/useReveal";
import { stats, studio } from "@/data/studio";
import { aboutImage } from "@/data/images";

export default function About() {
  const rootRef = useReveal<HTMLDivElement>();

  return (
    <section id="about" ref={rootRef} className="relative bg-bg py-28 md:py-44">
      <div className="px-6 md:px-16 text-center mb-20 md:mb-32" data-reveal>
        <p className="font-display italic text-2xl md:text-5xl max-w-3xl mx-auto leading-tight">
          &ldquo;We don&rsquo;t photograph events. We photograph the twelve seconds inside them that
          people will remember for the rest of their lives.&rdquo;
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 md:gap-20 px-6 md:px-16 items-center mb-20 md:mb-32">
        <div className="relative aspect-[4/5] img-blend overflow-hidden" data-reveal>
          <Image src={aboutImage.src} alt={aboutImage.alt} fill className="object-cover" sizes="50vw" />
        </div>
        <div data-reveal>
          <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">05 — Studio</p>
          <h2 className="font-display italic text-3xl md:text-5xl mb-6">
            Founded in {studio.founded}, still shooting on instinct.
          </h2>
          <p className="text-fg-dim leading-relaxed max-w-md">
            {studio.fullName} started as one photographer with a single camera and a refusal to shoot
            anything staged. Eleven years later the crew has grown, the gear has changed — the instinct
            hasn&rsquo;t.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-16 text-center">
        {stats.map((s) => (
          <div key={s.label} data-reveal>
            <p className="font-display text-3xl md:text-5xl text-accent">{s.value}</p>
            <p className="mt-2 text-xs tracking-[0.2em] uppercase text-fg-dim">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
