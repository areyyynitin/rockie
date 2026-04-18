import { useEffect, useRef } from "react";

export default function ChapterThree({ playTrack , stopTrack }) {

  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof playTrack !== "function") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // entering Chapter 1
          playTrack("/music/3.mp3");
        } else {
          // leaving Chapter 1
          stopTrack?.();
        }
      },
      {
        threshold: 0.3, // was 0.6
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [playTrack, stopTrack]);


  return (
    <section
      ref={sectionRef}
      className="h-screen w-full bg-black flex items-center justify-center text-white text-center"
    >
      <h1 className="text-4xl md:text-6xl font-fantomen uppercase">
        Chapter 3:The Bastard king of nerul
      </h1>

    </section>
  );
}