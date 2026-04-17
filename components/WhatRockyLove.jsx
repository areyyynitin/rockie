import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PugLoveSection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // text animation
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
        },
        opacity: 0,
        y: 80,
        duration: 1,
      });

      // floating images
      gsap.fromTo(
        img1Ref.current,
        { y: 100 },
        {
          y: -100,
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        img2Ref.current,
        { y: -100 },
        {
          y: 100,
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-[200vh] relative"
      style={{ background: "var(--background)", color: "var(--text)" }}
    >
      {/* CENTER TEXT (sticky) */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-6">
        
        <p
          className="text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: "var(--primary)" }}
        >
          What He Loves
        </p>

        <h2 className="text-4xl md:text-5xl font-medium leading-tight max-w-3xl">
          It’s never the big things.
          <br />
          Just the ones that feel like home.
        </h2>

        <p className="mt-6 opacity-70 ">
          A quiet moment. A familiar taste.  
          And somehow… everything feels right.
        </p>
      </div>

      {/* FLOATING IMAGES */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* LEFT IMAGE */}
        <div
          ref={img1Ref}
          className="absolute left-10 top-[30%] w-[220px] md:w-[280px] h-[300px] rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src="/drunk/eggs.jpeg"
            alt="eggs"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT IMAGE */}
        <div
          ref={img2Ref}
          className="absolute right-10 top-[50%] w-[220px] md:w-[280px] h-[300px] rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src="/drunk/treats.avif"
            alt="treats"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}