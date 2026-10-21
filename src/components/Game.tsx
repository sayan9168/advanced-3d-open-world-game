"use client";

import { Canvas } from "@react-three/fiber";
import { Sky, Stars, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Suspense, useState, useCallback } from "react";
import { Player } from "./Player";
import { World } from "./World";
import { GameUI } from "./GameUI";
import * as THREE from "three";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
];

export default function Game() {
  const [bullets, setBullets] = useState<
    { id: number; origin: THREE.Vector3; dir: THREE.Vector3 }[]
  >([]);

  const handleShoot = useCallback((origin: THREE.Vector3, dir: THREE.Vector3) => {
    const id = Date.now() + Math.random();
    setBullets((prev) => [...prev, { id, origin: origin.clone(), dir: dir.clone() }]);
  }, []);

  return (
    <div className="relative w-full h-full bg-black">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 75, near: 0.1, far: 400 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={["#87CEEB"]} />
          <fog attach="fog" args={["#a0d8ef", 60, 220]} />

          <ambientLight intensity={0.45} />
          <directionalLight
            castShadow
            position={[40, 70, 25]}
            intensity={1.35}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={160}
            shadow-camera-left={-80}
            shadow-camera-right={80}
            shadow-camera-top={80}
            shadow-camera-bottom={-80}
          />
          <hemisphereLight intensity={0.35} groundColor="#2a5c1a" />

          <Sky
            distance={450000}
            sunPosition={[40, 35, 20]}
            inclination={0.55}
            azimuth={0.2}
          />
          <Stars radius={280} depth={50} count={3500} factor={3.5} saturation={0.2} fade speed={0.4} />

          <Suspense fallback={null}>
            <Physics gravity={[0, -22, 0]}>
              <World bullets={bullets} setBullets={setBullets} />
              <Player onShoot={handleShoot} />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <GameUI />
    </div>
  );
}
