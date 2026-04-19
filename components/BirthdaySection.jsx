import { useEffect, useRef, useState } from "react";

const VIDEO_URL =
  "/drunk/rocky.mp4"; // placeholder — swap with your video

export default function BirthdaySection() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const videoWrapRef = useRef(null);
  const lineRef = useRef(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => setGsapLoaded(true);
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  useEffect(() => {
    if (!gsapLoaded || !window.gsap) return;
    const { gsap } = window;

    gsap.set([headlineRef.current, subRef.current, lineRef.current], {
      opacity: 0,
      y: 28,
    });
    gsap.set(videoWrapRef.current, { opacity: 0, scale: 0.96, y: 32 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(videoWrapRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.9 })
      .to(lineRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.65 }, "-=0.25")
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.55 }, "-=0.35");
  }, [gsapLoaded]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying((p) => !p);
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "#FAF9F6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Decorative top rule */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2.5rem",
          opacity: 0.35,
        }}
      >
        <div style={{ width: 48, height: 1, background: "#1a1a1a" }} />
        <svg width="8" height="8" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" fill="#1a1a1a" />
        </svg>
        <div style={{ width: 48, height: 1, background: "#1a1a1a" }} />
      </div>

      {/* Video card */}
      <div
        ref={videoWrapRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 680,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.04), 0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
          background: "#111",
          cursor: "pointer",
        }}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          style={{ display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover" }}
          onEnded={() => setPlaying(false)}
        />

        {/* Play / Pause overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: playing ? "transparent" : "rgba(10,10,10,0.28)",
            transition: "background 0.3s",
            pointerEvents: "none",
          }}
        >
          {!playing && (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(250,249,246,0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <polygon points="7,4 19,11 7,18" fill="#1a1a1a" />
              </svg>
            </div>
          )}
        </div>

        {/* Bottom label bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "1.25rem 1.5rem 1rem",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "rgba(250,249,246,0.65)",
              textTransform: "uppercase",
              fontFamily: "'Georgia', serif",
            }}
          >
            Rocky&nbsp;&nbsp;·&nbsp;&nbsp;A film
          </p>
        </div>
      </div>

      {/* Thin separator */}
      <div
        ref={lineRef}
        style={{
          width: 40,
          height: 1,
          background: "#C8A96E",
          margin: "2.25rem 0 1.75rem",
          opacity: 0,
        }}
      />

      {/* Headline */}
      <h1
        ref={headlineRef}
        style={{
          margin: 0,
          fontSize: "clamp(1.55rem, 4vw, 2.35rem)",
          fontWeight: 400,
          color: "#1a1a1a",
          textAlign: "center",
          lineHeight: 1.35,
          maxWidth: 560,
          letterSpacing: "-0.01em",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          opacity: 0,
        }}
      >
        How Rocky celebrates his birthday
        <br />
        <em style={{ fontStyle: "italic", color: "#3d3d3d" }}>
          when no one's home.
        </em>
      </h1>

    

    </div>
  );
}