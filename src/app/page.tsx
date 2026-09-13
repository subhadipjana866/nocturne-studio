"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero3D from "@/components/hero/Hero3D";
import WeddingStories from "@/components/sections/WeddingStories";
import Portraits from "@/components/sections/Portraits";
import PartiesEvents from "@/components/sections/PartiesEvents";
import FeaturedWork from "@/components/sections/FeaturedWork";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import ClosingCTA from "@/components/sections/ClosingCTA";
import Footer from "@/components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <SmoothScroll>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <CustomCursor />
      <Nav />
      <main>
        <Hero3D />
        <WeddingStories />
        <Portraits />
        <PartiesEvents />
        <FeaturedWork />
        <About />
        <Testimonials />
        <ClosingCTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
