import { useEffect, useRef } from "react";

export default function ChapterTwo({ playTrack , stopTrack }) {

  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof playTrack !== "function") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // entering Chapter 1
          playTrack("/music/2.mp3");
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
  className="h-screen w-full bg-black flex items-center justify-center font-fantomen text-white px-4"
>
  <div className="text-center">

    <p className="tracking-widest text-white/60 mb-2">
      Chapter 2
    </p>

    <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium">
      Stranger in the land of shadows
    </h1>

  </div>
</section>
  );
}