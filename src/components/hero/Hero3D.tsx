"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import GalleryScene from "./GalleryScene";
import HeroOverlay from "./HeroOverlay";
import { useMediaFlags } from "@/hooks/useMediaFlags";
import ScrubCanvas from "@/components/ScrubCanvas";
import { heroGallery, videoSlots } from "@/data/images";
import { textPhaseStrength } from "@/data/heroBeats";
import Image from "next/image";
import { studio } from "@/data/studio";

gsap.registerPlugin(ScrollTrigger);

/**
 * Dramatic 3D hero. Scrolling dollies a camera through floating prints,
 * alternating with text phases where the prints clear out and the backdrop
 * footage comes up bright behind the type (see data/heroBeats).
 *
 * The whole hero is pinned for 500vh, so the backdrop's full frame
 * sequence plays out before the page moves on.
 */
export default function Hero3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const galleryWrapRef = useRef<HTMLDivElement>(null);
  const washWrapRef = useRef<HTMLDivElement>(null);
  const { isDesktop, reducedMotion, ready } = useMediaFlags();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion || !mounted) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });
    return () => st.kill();
  }, [reducedMotion, mounted]);

  // Crossfade prints against backdrop as the hero moves between its image
  // and text phases.
  useEffect(() => {
    if (reducedMotion || !mounted) return;
    const tick = () => {
      const strength = textPhaseStrength(progressRef.current ?? 0);
      if (galleryWrapRef.current) {
        galleryWrapRef.current.style.opacity = String(1 - strength * 0.95);
      }
      if (washWrapRef.current) {
        washWrapRef.current.style.opacity = String(0.2 + strength * 0.75);
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [reducedMotion, mounted]);

  useEffect(() => {
    if (!isDesktop || reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isDesktop, reducedMotion]);

  if (!ready) {
    return <section className="h-screen bg-bg" />;
  }

  if (reducedMotion) {
    return (
      <section className="relative h-screen bg-bg overflow-hidden flex items-center justify-center">
        <Image
          src={heroGallery[0].src}
          alt={heroGallery[0].alt}
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="font-display italic text-[15vw] md:text-[7vw] leading-[0.95] text-fg">
            {studio.name}
          </h1>
          <p className="mt-4 max-w-lg mx-auto font-display italic text-xl text-fg-dim">
            {studio.tagline}
          </p>
        </div>
      </section>
    );
  }

  const photoCount = isDesktop ? 14 : 8;
  const ambient = videoSlots.heroAmbient;

  return (
    <section ref={sectionRef} className="relative h-[500vh] bg-bg">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-bg">
        <div ref={galleryWrapRef} className="absolute inset-0">
          {mounted && (
            <Canvas dpr={[1, isDesktop ? 2 : 1.5]} gl={{ antialias: true, alpha: false }}>
              <color attach="background" args={["#07070a"]} />
              <PerspectiveCamera makeDefault fov={48} position={[0, 0, 6]} />
              <GalleryScene progressRef={progressRef} mouseRef={mouseRef} count={photoCount} />
            </Canvas>
          )}
        </div>

        {/* Backdrop footage. Sits low behind the prints, then comes up
            bright on its own during the text phases. */}
        {ambient.sequence ? (
          <div ref={washWrapRef} className="pointer-events-none absolute inset-0 opacity-20">
            <ScrubCanvas
              sequence={ambient.sequence}
              progressRef={progressRef}
              className="h-full w-full"
            />
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_32%,rgba(7,7,10,0.88)_100%)]" />

        <HeroOverlay progressRef={progressRef} />
      </div>
    </section>
  );
}
