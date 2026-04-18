import { useEffect, useRef } from "react";
import CircularGallery from "../src/ui/CircularGallery";

export default function OldMonk() {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const audio = audioRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          audio.volume = 0;
          audio.play().catch(() => {});

          let vol = 0;
          const fade = setInterval(() => {
            if (vol < 1) {
              vol += 0.1;
              audio.volume = vol;
            } else {
              clearInterval(fade);
            }
          }, 100);
        } else {
          // ⏸ pause + reset
          audio.pause();
          audio.currentTime = 0;
        }
      },
      { threshold: 0.6 }
    );

    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full bg-[#d2d88e] flex flex-col items-center justify-center gap-6"
    >
      <h2 className="text-5xl text-white font-fantomen my-10">
        Party toh banti hai
      </h2>

      <div style={{ height: "600px", width: "100%", position: "relative" }}>
        <CircularGallery
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
          scrollSpeed={2}
        />
      </div>

      <audio
        ref={audioRef}
        src="/music/2-0.mp3"
        preload="auto"
        loop
      />
    </section>
  );
}