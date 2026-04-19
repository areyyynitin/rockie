"use client";

import { useRef, useState } from "react";
import ChapterOne from "./chapterOne";
import ChapterTwo from "./ChapterTwo";
import ChapterThree from "./ChapterThree";
import ChapterFour from "./ChapterFour";
import ChapterFive from "./ChapterFive";
import Story from "./Aaariaari";
import ChapterSix from "./ChapterSix";
import HeroIntro from "./HeroIntro";
import OldMonk from "./OldMonk";
import LoveSection from "./LoveSection";
import WhatRockyLoves from "./WhatRockyLove";
import BirthdaySection from "./BirthdaySection";



export default function StoryExperience() {
  const audioRef = useRef(null);

  const [entered, setEntered] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const enterWithSound = async () => {
    setSoundEnabled(true);
    setEntered(true);

    const audio = audioRef.current;

    if (audio) {
      try {
        await audio.play();
        audio.pause();
        audio.currentTime = 0;
      } catch (err) {
        console.log("unlock failed:", err);
      }
    }
  };

  const enterSilent = () => {
    setSoundEnabled(false);
    setEntered(true);
  };

  const playTrack = (src) => {
    if (!soundEnabled) return;

    const audio = audioRef.current;
    if (!audio) return;

    // Only change source if different
    if (!audio.src.includes(src)) {
      audio.src = src;
      audio.load();
    }

    // Always play when section re-enters
    audio.play().catch((err) => {
      console.log("Track play failed:", err);
    });
  };

  const stopTrack = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();

    // optional:
    // audio.currentTime = 0;
  };

  return (
    <>
      {/* Shared audio player */}
      <audio ref={audioRef} preload="auto" />

      {!entered && (
       <div className="fixed inset-0 bg-black text-white flex flex-col justify-between items-center px-6 py-10">

  {/* CENTER CONTENT */}
  <div className="flex flex-1 items-center justify-center">
    <div className="text-center space-y-6 max-w-3xl">

      {/* Main Sanskrit Content */}
      <p className="text-lg md:text-2xl font-light leading-relaxed tracking-wide">
        यः दिवसः त्वं रॉकी-सह समयं यापयसि, स एव फलदायकः दिवसः।
      </p>

      {/* English meaning */}
        <p className="text-lg md:text-2xl font-light leading-relaxed tracking-wide">
        The day you spend time with Rocky is the productive day.
      </p>

      {/* Signature */}
       <p className="text-lg md:text-2xl font-light leading-relaxed tracking-wide">
        — Samay Raina · Still alive, verse after 3 FIR
      </p>

    </div>
  </div>

  {/* BOTTOM ACTION AREA */}
  <div className="w-full max-w-4xl text-center space-y-6">


   {/* Buttons */}
<div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">

  <button
    onClick={enterWithSound}
    className="px-6 py-2 rounded-md border border-white/20 text-white text-sm font-medium
               hover:bg-white hover:text-black transition-colors duration-200"
  >
    Enter With Sound
  </button>

  <button
    onClick={enterSilent}
    className="px-6 py-2 rounded-md border border-white/10 text-white/70 text-sm font-medium
               hover:border-white/40 hover:text-white transition-colors duration-200"
  >
    Enter Silently
  </button>

</div>

  </div>

</div>
      )}

      {entered && (
        <>
          <ChapterOne playTrack={playTrack} stopTrack={stopTrack} />
          <Story />

          <ChapterTwo playTrack={playTrack} stopTrack={stopTrack} />
          <HeroIntro />

          <ChapterThree playTrack={playTrack} stopTrack={stopTrack} />
          <OldMonk />

          <ChapterFour playTrack={playTrack} stopTrack={stopTrack} />
          <LoveSection />

          <ChapterFive playTrack={playTrack} stopTrack={stopTrack} />
          <WhatRockyLoves />

          <ChapterSix playTrack={playTrack} stopTrack={stopTrack} />
          {/* <BirthdaySection /> */}

        </>
      )}
    </>
  );
}