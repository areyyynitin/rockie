"use client";

import { useEffect, useRef } from "react";

export default function ChapterOne({ playTrack, stopTrack }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const el = sectionRef.current;

    const triggerIfVisible = () => {
      const rect = el.getBoundingClientRect();

      const visibleEnough =
        rect.top < window.innerHeight * 0.7 &&
        rect.bottom > window.innerHeight * 0.3;

      if (visibleEnough) {
        playTrack("/music/1.mp3");
      }
    };

    // FIX: run once immediately on mount
    setTimeout(triggerIfVisible, 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playTrack("/music/1.mp3");
        } else {
          stopTrack?.();
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [playTrack, stopTrack]);

  return (
   <section
  ref={sectionRef}
  className="h-screen w-full bg-black flex items-center justify-center font-fantomen text-white px-4"
>
  <div className="text-center">

    <p className="tracking-widest text-white/60 mb-2">
      Chapter 1
    </p>

    <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium">
     A burnt memory
    </h1>

  </div>
</section>
  );
}


