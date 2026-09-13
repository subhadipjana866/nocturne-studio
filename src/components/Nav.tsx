"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { nav, studio } from "@/data/studio";

/**
 * Minimal fixed nav. Hidden until the hero has scrolled past (so it
 * never competes with the 3D gallery), then fades in and stays fixed.
 */
export default function Nav() {
  const rootRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let shown = false;

    const onScroll = () => {
      const should = window.scrollY > window.innerHeight * 0.7;
      if (should === shown) return;
      shown = should;
      gsap.to(el, {
        opacity: should ? 1 : 0,
        y: should ? 0 : -12,
        duration: 0.5,
        ease: "power2.out",
        pointerEvents: should ? "auto" : "none",
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={rootRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 opacity-0 -translate-y-3 pointer-events-none backdrop-blur-sm bg-bg/40"
    >
      <a href="#" className="font-display text-lg tracking-[0.15em]" data-cursor-hover>
        {studio.name}
      </a>

      <ul className="hidden md:flex items-center gap-8 text-sm text-fg-dim">
        {nav.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="hover:text-fg transition-colors duration-300"
              data-cursor-hover
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="hidden md:inline-block text-sm border border-line px-5 py-2 rounded-full hover:border-accent hover:text-accent transition-colors duration-300"
        data-cursor-hover
      >
        Inquire
      </a>

      <button
        className="md:hidden text-sm border border-line px-4 py-2 rounded-full"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg border-t border-line px-6 py-6 flex flex-col gap-4">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-lg"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="text-lg text-accent" onClick={() => setOpen(false)}>
            Inquire
          </a>
        </div>
      )}
    </nav>
  );
}
