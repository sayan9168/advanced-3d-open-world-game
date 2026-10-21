"use client";

import { Canvas } from "@react-three/fiber";
import { Sky, Stars, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Suspense, useState, useEffect } from "react";
import { Player } from "./Player";
import { World } from "./World";
import { GameUI } from "./GameUI";
import { useGameStore } from "@/store/gameStore";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
];

export default function Game() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleClick = () => {
      document.body.requestPointerLock?.();
    };
    window.addEventListener("click", handleClick);
    setReady(true);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative w-full h-full">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 75, near: 0.1, far: 1000 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={["#87CEEB"]} />
          <fog attach="fog" args={["#87CEEB", 80, 250]} />

          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[50, 80, 30]}
            intensity={1.2}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={200}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />
          <hemisphereLight intensity={0.3} groundColor="#3a5f0b" />

          <Sky
            distance={450000}
            sunPosition={[50, 40, 20]}
            inclination={0.6}
            azimuth={0.25}
          />
          <Stars radius={300} depth={60} count={4000} factor={4} saturation={0} fade speed={0.5} />

          <Suspense fallback={null}>
            <Physics gravity={[0, -20, 0]} debug={false}>
              <World />
              <Player />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <GameUI />
    </div>
  );
}
