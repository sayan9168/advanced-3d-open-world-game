"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";

function getHeight(x: number, z: number) {
  return (
    Math.sin(x * 0.05) * 3 +
    Math.cos(z * 0.04) * 2.5 +
    Math.sin(x * 0.02 + z * 0.03) * 4
  );
}

function Terrain() {
  const size = 200;
  const segments = 64;

  const geometry = useMemo(() => {
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
        <meshStandardMaterial
          color="#3d7a2c"
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>
    </RigidBody>
  );
}

function Trees() {
  const trees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 120; i++) {
      const x = (Math.random() - 0.5) * 180;
      const z = (Math.random() - 0.5) * 180;
      const y = getHeight(x, z);
      const scale = 0.8 + Math.random() * 1.2;
      arr.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return arr;
  }, []);

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={t.position} scale={t.scale}>
          <mesh castShadow position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 2.5, 8]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 3.2, 0]}>
            <coneGeometry args={[1.8, 3.5, 8]} />
            <meshStandardMaterial color="#1a5c1a" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 4.8, 0]}>
            <coneGeometry args={[1.3, 2.5, 8]} />
            <meshStandardMaterial color="#227a22" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Collectible({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const collected = useRef(false);
  const { collectItem } = useGameStore();

  useFrame((state) => {
    if (ref.current && !collected.current) {
      ref.current.rotation.y += 0.03;
      ref.current.position.y =
        position[1] + 1.2 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.25;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <RigidBody
        type="fixed"
        colliders="ball"
        position={position}
        sensor
        onIntersectionEnter={() => {
          if (!collected.current) {
            collected.current = true;
            collectItem();
            if (ref.current) ref.current.visible = false;
          }
        }}
      >
        <mesh ref={ref} castShadow>
          <icosahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.6}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </RigidBody>
    </Float>
  );
}

function Collectibles() {
  const items = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 160;
      const z = (Math.random() - 0.5) * 160;
      const y = getHeight(x, z) + 0.5;
      arr.push([x, y, z]);
    }
    return arr;
  }, []);

  return (
    <>
      {items.map((pos, i) => (
        <Collectible key={i} position={pos} />
      ))}
    </>
  );
}

function Rocks() {
  const rocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * 180;
      const z = (Math.random() - 0.5) * 180;
      const y = getHeight(x, z);
      const s = 0.5 + Math.random() * 1.5;
      arr.push({ position: [x, y + s * 0.4, z] as [number, number, number], scale: s });
    }
    return arr;
  }, []);

  return (
    <>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.position} scale={r.scale} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#6b7280" roughness={0.95} flatShading />
        </mesh>
      ))}
    </>
  );
}

export function World() {
  return (
    <group>
      <Terrain />
      <Trees />
      <Rocks />
      <Collectibles />

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1, 50, 120]} position={[-110, 25, 0]} />
        <CuboidCollider args={[1, 50, 120]} position={[110, 25, 0]} />
        <CuboidCollider args={[120, 50, 1]} position={[0, 25, -110]} />
        <CuboidCollider args={[120, 50, 1]} position={[0, 25, 110]} />
      </RigidBody>
    </group>
  );
}
