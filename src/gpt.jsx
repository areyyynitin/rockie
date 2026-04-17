// =========================
// FILE: RockyApp.tsx
// =========================
import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroIntro from "../components/HeroIntro";
import OldMonk from "../components/OldMonk";
import LoveSection from "../components/LoveSection";
import WhatRockyLoves from "../components/WhatRockyLove";
import BirthdaySection from "../components/BirthdaySection";
import ChapterOne from "../components/chapterOne";
import ChapterTwo from "../components/ChapterTwo";
import ChapterThree from "../components/ChapterThree";
import ChapterFour from "../components/ChapterFour";
import ChapterFive from "../components/ChapterFive";


gsap.registerPlugin(ScrollTrigger);

export default function RockyApp() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="text-(--text) bg-(--background)">
      <ChapterOne />
      <HeroIntro />
      <ChapterTwo />
      <OldMonk />
      <ChapterThree />
      <LoveSection />
      <ChapterFour />
      <WhatRockyLoves />
      <ChapterFive />
      <BirthdaySection />
    </div>
  );
}

