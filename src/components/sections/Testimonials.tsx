"use client";

import { useReveal } from "@/hooks/useReveal";
import { testimonials } from "@/data/studio";

export default function Testimonials() {
  const rootRef = useReveal<HTMLDivElement>("[data-reveal]", { stagger: 0.12 });

  return (
    <section ref={rootRef} className="relative bg-bg py-28 md:py-44">
      <div className="px-6 md:px-16 mb-16" data-reveal>
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">06 — Voices</p>
      </div>
      <div className="grid md:grid-cols-3 gap-10 px-6 md:px-16">
        {testimonials.map((t) => (
          <div key={t.name} data-reveal className="border-t border-line pt-8">
            <p className="font-display italic text-lg md:text-2xl leading-snug mb-6">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-sm text-fg">{t.name}</p>
            <p className="text-xs text-fg-dim uppercase tracking-[0.2em] mt-1">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
