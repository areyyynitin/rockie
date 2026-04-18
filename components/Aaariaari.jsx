"use client";

import { useEffect, useRef } from "react";

export default function Story() {
  const chapterTwoRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;

        if (entry.isIntersecting) {
          videoRef.current.play().catch(console.error);
        } else {
          videoRef.current.pause();
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (chapterTwoRef.current) {
      observer.observe(chapterTwoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={chapterTwoRef}
      className="h-screen overflow-hidden"
    >
      <video
        ref={videoRef}
        playsInline
        loop
        muted={false}
        preload="auto"
        className="w-full h-full object-cover"
      >
        <source src="/aari.mp4" type="video/mp4" />
      </video>
    </section>
  );
}