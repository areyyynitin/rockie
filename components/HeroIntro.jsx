"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Text } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

/* -------------------- 3D Model -------------------- */
function Model() {
  const { scene } = useGLTF("/models/pug.glb"); // ✅ must be in /public/models/
  const ref = useRef(null);

  // subtle floating + rotation (premium feel)
  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.y += 0.003;
    ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
  });

  return <primitive ref={ref} object={scene} scale={1.5} />;
}

/* -------------------- Main Component -------------------- */
export default function HeroIntro() {
  return (
    <div className="w-full h-screen relative bg-amber-600 overflow-hidden">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="cursor-pointer">
        {/* Lighting (soft + premium) */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 5]} intensity={1.2} />
        <pointLight position={[-2, -2, -2]} intensity={0.5} />

        <Suspense fallback={null}>
          <Model />

          {/* 3D Text (subtle, secondary) */}
          <Text
            position={[0, -2, 0]}
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {/* We never realize how much joy someone brings… */}
          </Text>
        </Suspense>

        {/* Controls */}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      {/* 🔥 Premium Glass UI Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full px-6 flex justify-center">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl px-6 py-5 max-w-xl text-center">
          
          {/* Small label */}
          <p className="text-xs tracking-[0.2em] uppercase text-white/60 mb-3">
            Unexpected Moments
          </p>

          {/* Main heading */}
          <h1 className="text-2xl md:text-4xl font-medium text-white leading-tight">
            We never realize  
            <br />
            how much joy someone brings…
          </h1>

          {/* Sub text */}
          <p className="mt-4 text-sm md:text-base text-white/60">
            Until one day, everything feels a little lighter, a little warmer
            just because they’re there.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Preload model (performance boost) */
useGLTF.preload("/models/pug.glb");