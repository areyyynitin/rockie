import { useEffect, useRef } from "react";

export default function ChapterOne() {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const audio = audioRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          audio.play().catch(() => {});
        } else {
          audio.pause();
          audio.currentTime = 0; // reset (optional)
        }
      },
      { threshold: 0.6 } // 60% visible
    );

    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full bg-black flex items-center justify-center text-white text-center"
    >
      <h1 className="text-4xl md:text-6xl font-fantomen">
        Chapter 2: Bastard king of nerul
      </h1>

      {/* 🔊 Audio */}
      <audio ref={audioRef} src="/music/2.mp3" preload="auto" />
    </section>
  );
}