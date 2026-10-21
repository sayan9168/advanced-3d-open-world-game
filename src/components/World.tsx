"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";

function getHeight(x: number, z: number) {
  return Math.sin(x * 0.045) * 2.8 + Math.cos(z * 0.038) * 2.2 + Math.sin(x * 0.018 + z * 0.025) * 3.5;
}

function Terrain() {
  const geometry = useMemo(() => {
    const size = 220;
    const segments = 72;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, getHeight(x, z));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#2d6a2d" roughness={0.85} flatShading />
      </mesh>
    </RigidBody>
  );
}

function Trees() {
  const trees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 90; i++) {
      const x = (Math.random() - 0.5) * 190;
      const z = (Math.random() - 0.5) * 190;
      if (Math.abs(x) < 12 && Math.abs(z) < 12) continue;
      const y = getHeight(x, z);
      const scale = 0.9 + Math.random() * 1.1;
      arr.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return arr;
  }, []);

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={t.position} scale={t.scale}>
          <mesh castShadow position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.22, 0.32, 2.3, 7]} />
            <meshStandardMaterial color="#6b3e26" />
          </mesh>
          <mesh castShadow position={[0, 2.9, 0]}>
            <coneGeometry args={[1.7, 3.2, 7]} />
            <meshStandardMaterial color="#1f7a3a" />
          </mesh>
          <mesh castShadow position={[0, 4.4, 0]}>
            <coneGeometry args={[1.2, 2.3, 7]} />
            <meshStandardMaterial color="#2ea043" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Enemy({ id, position, onDeath }: { id: number; position: [number, number, number]; onDeath: (id: number) => void }) {
  const meshRef = useRef<THREE.Group>(null);
  const [alive, setAlive] = useState(true);
  const health = useRef(100);
  const { addKill } = useGameStore();

  useFrame((state) => {
    if (!alive || !meshRef.current) return;
    meshRef.current.position.y = position[1] + 1.4 + Math.sin(state.clock.elapsedTime * 2.2 + id) * 0.35;
    meshRef.current.rotation.y += 0.012;
  });

  const hit = () => {
    health.current -= 40;
    if (health.current <= 0 && alive) {
      setAlive(false);
      addKill();
      onDeath(id);
    }
  };

  useEffect(() => {
    (window as any)[`__enemy_${id}`] = hit;
    return () => delete (window as any)[`__enemy_${id}`];
  }, [id]);

  if (!alive) return null;

  return (
    <group ref={meshRef} position={position}>
      <mesh castShadow>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#ff4d6d" emissive="#ff1744" emissiveIntensity={0.5} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0.25, 0.25, 0.7]}><sphereGeometry args={[0.12, 8, 8]} /><meshBasicMaterial color="#fff" /></mesh>
      <mesh position={[-0.25, 0.25, 0.7]}><sphereGeometry args={[0.12, 8, 8]} /><meshBasicMaterial color="#fff" /></mesh>
      <mesh position={[0.25, 0.25, 0.78]}><sphereGeometry args={[0.06, 8, 8]} /><meshBasicMaterial color="#111" /></mesh>
      <mesh position={[-0.25, 0.25, 0.78]}><sphereGeometry args={[0.06, 8, 8]} /><meshBasicMaterial color="#111" /></mesh>
    </group>
  );
}

function BulletTrail({ start, end, onDone }: { start: THREE.Vector3; end: THREE.Vector3; onDone: () => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const progress = useRef(0);

  useFrame((_, delta) => {
    progress.current += delta * 8;
    if (progress.current >= 1) { onDone(); return; }
    if (ref.current) ref.current.position.lerpVectors(start, end, progress.current);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshBasicMaterial color="#00f0ff" />
    </mesh>
  );
}

export function World({ bullets, setBullets }: { bullets: { id: number; origin: THREE.Vector3; dir: THREE.Vector3 }[]; setBullets: React.Dispatch<React.SetStateAction<{ id: number; origin: THREE.Vector3; dir: THREE.Vector3 }[]>>; }) {
  const [enemies, setEnemies] = useState(() => {
    const arr = [];
    for (let i = 0; i < 18; i++) {
      const x = (Math.random() - 0.5) * 160;
      const z = (Math.random() - 0.5) * 160;
      if (Math.abs(x) < 15 && Math.abs(z) < 15) continue;
      const y = getHeight(x, z) + 0.5;
      arr.push({ id: i, position: [x, y, z] as [number, number, number] });
    }
    return arr;
  });

  const removeEnemy = (id: number) => setEnemies((prev) => prev.filter((e) => e.id !== id));

  useEffect(() => {
    bullets.forEach((b) => {
      enemies.forEach((e) => {
        const enemyPos = new THREE.Vector3(...e.position);
        enemyPos.y += 1.4;
        const toEnemy = enemyPos.clone().sub(b.origin);
        const dirNorm = b.dir.clone().normalize();
        const projected = dirNorm.dot(toEnemy);
        if (projected > 0 && projected < 80) {
          const closest = b.origin.clone().add(dirNorm.multiplyScalar(projected));
          if (closest.distanceTo(enemyPos) < 1.6) {
            const hitFn = (window as any)[`__enemy_${e.id}`];
            if (hitFn) hitFn();
          }
        }
      });
    });
  }, [bullets, enemies]);

  return (
    <group>
      <Terrain />
      <Trees />
      {enemies.map((e) => (
        <Enemy key={e.id} id={e.id} position={e.position} onDeath={removeEnemy} />
      ))}
      {bullets.map((b) => {
        const end = b.origin.clone().add(b.dir.clone().multiplyScalar(60));
        return (
          <BulletTrail key={b.id} start={b.origin} end={end} onDone={() => setBullets((prev) => prev.filter((x) => x.id !== b.id))} />
        );
      })}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1, 50, 130]} position={[-120, 25, 0]} />
        <CuboidCollider args={[1, 50, 130]} position={[120, 25, 0]} />
        <CuboidCollider args={[130, 50, 1]} position={[0, 25, -120]} />
        <CuboidCollider args={[130, 50, 1]} position={[0, 25, 120]} />
      </RigidBody>
    </group>
  );
}
