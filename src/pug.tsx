import { useEffect, useRef } from "react";

// Install these packages:
// npm install gsap @studio-freight/lenis
// npm install -D @types/gsap

declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

export default function RockyBirthday() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const heroEyebrowRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const noteTextRef = useRef<HTMLParagraphElement>(null);
  const speakBtnRef = useRef<HTMLButtonElement>(null);
  const twStartedRef = useRef(false);

  // ── Lenis smooth scroll ──────────────────────────────────────────────────
  useEffect(() => {
    let lenis: any;
    import("@studio-freight/lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }).catch(() => {});
    return () => { lenis?.destroy(); };
  }, []);

  // ── Custom cursor ────────────────────────────────────────────────────────
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, rafId = 0;
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
    };
    const animate = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
      rafId = requestAnimationFrame(animate);
    };
    document.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(animate);
    const hoverEls = document.querySelectorAll("a,button,.quirk-card");
    const enter = () => { if (ring) { ring.style.width = "48px"; ring.style.height = "48px"; } };
    const leave = () => { if (ring) { ring.style.width = "32px"; ring.style.height = "32px"; } };
    hoverEls.forEach(el => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      hoverEls.forEach(el => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
    };
  }, []);

  // ── GSAP animations ──────────────────────────────────────────────────────
  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Hero entrance
        const tl = gsap.timeline({ delay: 0.3 });
        tl.fromTo(heroEyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
          .fromTo(heroTitleRef.current,   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1,   ease: "power3.out" }, "-=0.4")
          .fromTo(heroSubRef.current,     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
          .fromTo(heroBadgeRef.current,   { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3")
          .fromTo(scrollHintRef.current,  { opacity: 0 },         { opacity: 1, duration: 0.6 }, "-=0.1");

        // Scroll reveals
        document.querySelectorAll<HTMLElement>(".reveal-up").forEach(el => {
          gsap.fromTo(el, { opacity: 0, y: 45 }, {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          });
        });

        // Parallax paws
        gsap.to(".paw-scatter", {
          yPercent: -30, stagger: 0.1,
          scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.5 },
        });

        // Floating orbs
        gsap.to(".hero-bg-orb", { y: -20, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 1 });

        // Typewriter trigger
        ScrollTrigger.create({
          trigger: "#messages",
          start: "top 70%",
          onEnter: startTypewriter,
          once: true,
        });
      });
    });
  }, []);

  // ── Nav scroll effect ────────────────────────────────────────────────────
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("nav.rocky-nav");
    const onScroll = () => {
      if (nav) nav.style.background = window.scrollY > 50
        ? "rgba(250,247,242,0.97)" : "rgba(250,247,242,0.85)";
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Typewriter ───────────────────────────────────────────────────────────
  const noteMsg =
    "Rocky did enough to make Aditi happy. Now it's Aditi's duty to make Rocky happy… by feeding him goat 🐐. Because every great friendship is a two-way street — and Rocky has been walking this one on four stubby, perfect legs since day one.";

  function startTypewriter() {
    if (twStartedRef.current) return;
    twStartedRef.current = true;
    let idx = 0;
    const el = noteTextRef.current;
    if (!el) return;
    const tick = () => {
      if (idx < noteMsg.length) { el.textContent += noteMsg[idx++]; setTimeout(tick, 30); }
    };
    tick();
  }

  // ── Pug sound (Web Audio API) ────────────────────────────────────────────
  function playPugSound() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const snort = (start: number, freq: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, start + dur);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.start(start); osc.stop(start + dur);
    };
    const now = ctx.currentTime;
    snort(now, 320, 0.18); snort(now + 0.22, 280, 0.25);
    snort(now + 0.55, 340, 0.15); snort(now + 0.75, 260, 0.3);
    const btn = speakBtnRef.current;
    if (btn) {
      btn.textContent = "🐶  Woof Snort Snort!";
      setTimeout(() => { if (btn) btn.textContent = "🔊  Hear Rocky Speak"; }, 1800);
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Global styles injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        html { scroll-behavior: smooth; cursor: none; }
        body { background: #FAF7F2; }
        .cursor-dot  { position:fixed; width:8px;  height:8px;  background:#C9A84C; border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); }
        .cursor-ring { position:fixed; width:32px; height:32px; border:1.5px solid #C9A84C; border-radius:50%; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:width .2s,height .2s; }
        .font-serif  { font-family:'Playfair Display',serif; }
        .font-sans   { font-family:'DM Sans',sans-serif; }
        @keyframes scrollPulse { 0%,100%{opacity:.3;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.2)} }
        .scroll-line { animation: scrollPulse 2s ease-in-out infinite; }
        .quirk-card  { transition: transform .35s ease, box-shadow .35s ease; }
        .quirk-card:hover { transform: translateY(-6px) rotate(0.5deg); box-shadow: 0 16px 48px rgba(201,168,76,.18); }
        .speak-btn:hover  { background: #C9A84C !important; color: #1A1714 !important; }
        .speak-btn:active { transform: scale(0.97); }
        .paw-scatter { pointer-events:none; user-select:none; }
      `}</style>

      {/* Cursor */}
      <div className="cursor-dot"  ref={cursorDotRef}  />
      <div className="cursor-ring" ref={cursorRingRef} />

      {/* ── NAV ── */}
      <nav
        className="rocky-nav fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-5 border-b border-yellow-200/30 backdrop-blur-md transition-all duration-300"
        style={{ background: "rgba(250,247,242,0.85)", fontFamily: "'DM Sans',sans-serif" }}
      >
        <span className="font-serif text-lg tracking-wide text-stone-800">Rocky 🐾</span>
        <ul className="flex gap-8 list-none">
          {["story","quirks","messages","birthday","legacy"].map(id => (
            <li key={id}>
              <a href={`#${id}`} className="text-xs tracking-widest uppercase text-stone-500 no-underline hover:text-yellow-600 transition-colors duration-300">
                {id === "quirks" ? "Pug Life" : id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-8"
        style={{ background: "linear-gradient(160deg,#FAF7F2 0%,#F0E8D8 50%,#E8D5C4 100%)" }}>
        {/* Orbs */}
        <div className="hero-bg-orb absolute rounded-full pointer-events-none" style={{ width:500, height:500, background:"rgba(201,168,76,0.12)", top:-100, right:-100, filter:"blur(80px)" }} />
        <div className="hero-bg-orb absolute rounded-full pointer-events-none" style={{ width:400, height:400, background:"rgba(224,196,160,0.2)",  bottom:-80, left:-80,  filter:"blur(80px)" }} />
        {/* Paw scatters */}
        {[
          { top:"15%",  left:"8%",   size:"1.8rem" },
          { top:"70%",  right:"7%",  size:"1.4rem" },
          { top:"30%",  right:"15%", size:"1rem"   },
          { bottom:"25%",left:"20%", size:"2rem"   },
        ].map((s, i) => (
          <span key={i} className="paw-scatter absolute text-2xl" style={{ opacity:.12, fontSize:s.size, ...s }}>🐾</span>
        ))}

        <div ref={heroEyebrowRef} className="text-xs tracking-widest uppercase mb-6" style={{ color:"#C9A84C", opacity:0, fontFamily:"'DM Sans',sans-serif" }}>
          A Very Special Day
        </div>
        <h1 ref={heroTitleRef} className="font-serif text-center leading-tight" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(3rem,8vw,6.5rem)", color:"#1A1714", opacity:0, maxWidth:900 }}>
          Happy Birthday,<br /><em style={{ color:"#C9A84C" }}>Rocky</em> 🐾
        </h1>
        <p ref={heroSubRef} className="text-center mt-6 leading-relaxed font-light" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(.95rem,2vw,1.15rem)", color:"#6B6560", maxWidth:520, opacity:0 }}>
          The tiny paws that made life infinitely happier. Four legs, one heart, zero regrets.
        </p>
        <div ref={heroBadgeRef} className="mt-10 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs tracking-widest uppercase" style={{ border:"1px solid rgba(201,168,76,0.4)", color:"#C9A84C", opacity:0, fontFamily:"'DM Sans',sans-serif" }}>
          🎂 &nbsp; One Good Boy &nbsp;·&nbsp; Infinite Love
        </div>
        <div ref={scrollHintRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity:0 }}>
          <span className="text-xs tracking-widest uppercase" style={{ color:"#6B6560", fontFamily:"'DM Sans',sans-serif" }}>Scroll</span>
          <div className="scroll-line w-px h-10" style={{ background:"linear-gradient(to bottom,#C9A84C,transparent)" }} />
        </div>
      </section>

      {/* ── STORY ── */}
      <section id="story" className="min-h-screen flex items-center py-32 px-8" style={{ background:"#FAF7F2" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="reveal-up text-xs tracking-widest uppercase mb-5" style={{ color:"#C9A84C", fontFamily:"'DM Sans',sans-serif" }}>Chapter One</div>
            <h2 className="reveal-up font-serif mb-6 leading-snug" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", color:"#1A1714" }}>
              More Than Just<br />a Dog
            </h2>
            {[
              "Rocky didn't just arrive — he claimed his territory. From the first snort to the twentieth nap of the day, he made it crystal clear that this house belonged to him.",
              "He is a therapist who charges in cuddles, a comedian who performs without warning, and a chaos machine operating on a strict schedule of eating, sleeping, and demanding attention at 3am.",
              "To the world he is a pug. To us, he is a feeling — warm, wrinkled, and irreplaceable.",
            ].map((p, i) => (
              <p key={i} className="reveal-up leading-loose font-light mb-4 text-sm" style={{ color:"#6B6560", fontFamily:"'DM Sans',sans-serif" }}>{p}</p>
            ))}
          </div>
          <div className="reveal-up relative">
            <div className="rounded-3xl flex items-center justify-center overflow-hidden relative" style={{ background:"#F0E8D8", aspectRatio:"4/5", border:"1px solid rgba(201,168,76,0.2)" }}>
              <span style={{ fontSize:"8rem", filter:"drop-shadow(0 8px 24px rgba(0,0,0,.1))" }}>🐶</span>
              <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(201,168,76,.08),transparent)" }} />
            </div>
            <div className="absolute -bottom-5 -right-5 rounded-2xl p-4" style={{ background:"#FFFDF9", border:"1px solid rgba(201,168,76,0.3)", boxShadow:"0 8px 32px rgba(201,168,76,.1)" }}>
              <div className="font-serif text-3xl leading-none" style={{ color:"#C9A84C" }}>🐾</div>
              <div className="text-xs tracking-widest uppercase mt-1" style={{ color:"#6B6560", fontFamily:"'DM Sans',sans-serif" }}>Forever Friend</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUIRKS ── */}
      <section id="quirks" className="min-h-screen py-32 px-8" style={{ background:"#F0E8D8" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="reveal-up text-xs tracking-widest uppercase mb-4" style={{ color:"#C9A84C", fontFamily:"'DM Sans',sans-serif" }}>The Pug Life</div>
            <h2 className="reveal-up font-serif leading-snug" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,2.8rem)", color:"#1A1714" }}>
              Personality &amp; Quirks<br /><em style={{ color:"#C9A84C" }}>Chaos, Curated</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon:"🧠", title:"Secretly Genius",      text:"Pugs are smart — but they pretend to be dumb. Rocky has mastered selective understanding. He hears 'treat' from three floors away but goes deaf when told to move." },
              { icon:"😴", title:"Olympic Napper",        text:"Rocky treats sleep like a competitive sport. He naps through thunderstorms and major life events — but wakes instantly when a bag of chips opens in another room." },
              { icon:"👀", title:"Professional Judger",   text:"Those big dark eyes don't miss a thing. Rocky watches your every move with the intensity of a life coach who has given up on you — yet somehow still hasn't left." },
              { icon:"🎭", title:"Drama Royalty",         text:"Empty bowl? Tragedy. Bath time? Betrayal. Someone left without saying goodbye? Oscar-worthy performance. Rocky's emotional range would make any actor jealous." },
              { icon:"🍖", title:"Culinary Critic",       text:"Rocky has opinions about food. Specific, deeply held, non-negotiable opinions. Regular kibble: acceptable. Anything from your plate: divine. Vegetables as treats: grounds for a formal complaint." },
              { icon:"💨", title:"Sound Effects Artist",  text:"Snorts, snores, wheezes — Rocky produces a full soundscape that somehow becomes the most comforting soundtrack in any room. Home is Rocky breathing nearby." },
            ].map((c, i) => (
              <div key={i} className="quirk-card rounded-3xl p-7 cursor-default" style={{ background:"#FFFDF9", border:"1px solid rgba(201,168,76,0.2)" }}>
                <span className="text-4xl mb-4 block">{c.icon}</span>
                <h3 className="font-serif text-lg mb-2" style={{ fontFamily:"'Playfair Display',serif", color:"#1A1714" }}>{c.title}</h3>
                <p className="text-sm leading-relaxed font-light" style={{ color:"#6B6560", fontFamily:"'DM Sans',sans-serif" }}>{c.text}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button ref={speakBtnRef} onClick={playPugSound}
              className="speak-btn reveal-up rounded-full px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300"
              style={{ background:"#1A1714", color:"#E8D5A3", border:"none", fontFamily:"'DM Sans',sans-serif", cursor:"none" }}>
              🔊 &nbsp; Hear Rocky Speak
            </button>
          </div>
        </div>
      </section>

      {/* ── MESSAGES ── */}
      <section id="messages" className="min-h-screen flex items-center py-32 px-8" style={{ background:"#FAF7F2" }}>
        <div className="max-w-2xl mx-auto w-full">
          <div className="mb-12">
            <div className="reveal-up text-xs tracking-widest uppercase mb-4" style={{ color:"#C9A84C", fontFamily:"'DM Sans',sans-serif" }}>Love Notes</div>
            <h2 className="reveal-up font-serif" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,2.8rem)", color:"#1A1714" }}>Messages for Rocky</h2>
          </div>
          <div className="reveal-up relative rounded-3xl p-12" style={{ background:"#FFFDF9", border:"1px solid rgba(201,168,76,0.25)", boxShadow:"0 24px 80px rgba(201,168,76,.08)" }}>
            <div className="absolute font-serif text-9xl leading-none pointer-events-none select-none" style={{ color:"#E8D5A3", top:"-1rem", left:"1.5rem", fontFamily:"'Playfair Display',serif" }}>"</div>
            <p ref={noteTextRef} className="font-serif italic leading-relaxed mb-6 relative z-10" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.05rem,2.5vw,1.4rem)", color:"#1A1714", minHeight:"3em" }} />
            <div className="text-xs tracking-widest uppercase" style={{ color:"#C9A84C", fontFamily:"'DM Sans',sans-serif" }}>
              — Aditi &amp; Everyone Rocky has ever charmed 🐾
            </div>
          </div>
        </div>
      </section>

      {/* ── BIRTHDAY MEME ── */}
      <section id="birthday" className="min-h-screen flex items-center py-32 px-8" style={{ background:"#F0E8D8" }}>
        <div className="max-w-2xl mx-auto w-full text-center">
          <div className="mb-12">
            <div className="reveal-up text-xs tracking-widest uppercase mb-4" style={{ color:"#C9A84C", fontFamily:"'DM Sans',sans-serif" }}>Meme Documentation</div>
            <h2 className="reveal-up font-serif leading-snug" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,2.8rem)", color:"#1A1714" }}>
              Rocky's Birthday<br /><em style={{ color:"#C9A84C" }}>Master Plan</em>
            </h2>
          </div>
          <div className="reveal-up overflow-hidden rounded-3xl" style={{ background:"#1A1714", boxShadow:"0 32px 80px rgba(26,23,20,.3)" }}>
            <div className="px-8 py-5 font-serif text-2xl text-white tracking-wide" style={{ fontFamily:"'Playfair Display',serif", textShadow:"2px 2px 0 rgba(0,0,0,.5)" }}>
              POV: Rocky when he's home alone on his birthday
            </div>
            <div className="relative flex items-center justify-center" style={{ background:"linear-gradient(135deg,#2A2520,#1A1714)", aspectRatio:"16/9" }}>
              <span className="absolute text-5xl opacity-10" style={{ top:"10%", left:"5%" }}>🐾</span>
              <span className="absolute text-5xl opacity-10" style={{ bottom:"10%", right:"5%" }}>🎂</span>
              <div className="text-center z-10">
                <div className="text-8xl mb-4 leading-none">🐶</div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-transform duration-300 hover:scale-110" style={{ background:"rgba(201,168,76,0.9)" }}>
                  <div style={{ width:0, height:0, borderTop:"12px solid transparent", borderBottom:"12px solid transparent", borderLeft:"20px solid #1A1714", marginLeft:4 }} />
                </div>
                <p className="text-xs tracking-widest uppercase mt-3" style={{ color:"rgba(255,255,255,0.3)", fontFamily:"'DM Sans',sans-serif" }}>Add your video here</p>
              </div>
            </div>
            <div className="px-8 py-5 font-serif text-xl" style={{ color:"#C9A84C", fontFamily:"'Playfair Display',serif" }}>
              This is how Rocky plans his birthday if he's home alone 😎
            </div>
          </div>
        </div>
      </section>

      {/* ── LEGACY ── */}
      <section id="legacy" className="relative min-h-screen flex items-center justify-center py-40 px-8 text-center overflow-hidden" style={{ background:"#1A1714" }}>
        <div className="legacy-orb absolute rounded-full pointer-events-none" style={{ width:600, height:600, background:"rgba(201,168,76,0.06)", top:-200, right:-200, filter:"blur(100px)" }} />
        <div className="legacy-orb absolute rounded-full pointer-events-none" style={{ width:500, height:500, background:"rgba(224,196,160,0.04)", bottom:-100, left:-200, filter:"blur(100px)" }} />
        <div className="relative z-10 max-w-2xl">
          <span className="reveal-up block text-5xl mb-8 opacity-50">🐾</span>
          <div className="reveal-up inline-block rounded-full px-5 py-2 text-xs tracking-widest uppercase mb-8" style={{ border:"1px solid rgba(201,168,76,.3)", color:"#C9A84C", fontFamily:"'DM Sans',sans-serif" }}>
            Forever in every memory
          </div>
          <h2 className="reveal-up font-serif leading-snug mb-6" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", color:"#FAF7F2" }}>
            Some dogs are pets.<br />Rocky is a <em style={{ color:"#C9A84C" }}>memory</em>,<br />a feeling, a forever friend.
          </h2>
          <div className="reveal-up mx-auto my-8 h-px w-16" style={{ background:"linear-gradient(to right,transparent,#C9A84C,transparent)" }} />
          <p className="reveal-up leading-loose font-light mb-6 text-sm" style={{ color:"rgba(250,247,242,0.5)", fontFamily:"'DM Sans',sans-serif" }}>
            He didn't ask for much. A warm lap. A full bowl. Someone to steal socks from. And in return, he gave everything — unconditional presence, ridiculous joy, and a love that fits no category other than his own.
          </p>
          <p className="reveal-up font-serif italic" style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", color:"rgba(250,247,242,0.7)" }}>
            Happy Birthday, Rock. May your bowl always overflow. 🐾
          </p>
          <div className="reveal-up mt-12 text-xs tracking-widest uppercase" style={{ color:"rgba(201,168,76,.5)", fontFamily:"'DM Sans',sans-serif" }}>
            Made with love · Rocky's Universe · Forever
          </div>
        </div>
      </section>
    </>
  );
}