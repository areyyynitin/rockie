// =========================
// FILE: RockyApp.tsx
// =========================
import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StoryExperience from "../components/landing";

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
      <StoryExperience />

      
      
    </div>
  );
}

