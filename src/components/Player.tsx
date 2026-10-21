"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, CapsuleCollider, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";

const SPEED = 9;
const SPRINT_MULTIPLIER = 1.7;
const JUMP_FORCE = 9;

export function Player({ onShoot }: { onShoot: (origin: THREE.Vector3, direction: THREE.Vector3) => void }) {
  const body = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();
  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());
  const isGrounded = useRef(true);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const lastShot = useRef(0);

  const { shoot, reload, isMobile, gameStarted } = useGameStore();

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement && !isMobile) {
        yaw.current -= e.movementX * 0.0022;
        pitch.current -= e.movementY * 0.0022;
        pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current));
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [isMobile]);

  useEffect(() => {
    const onClick = () => {
      if (!gameStarted || isMobile) return;
      if (document.pointerLockElement) {
        tryShoot();
      }
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [gameStarted, isMobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyR") reload();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reload]);

  const tryShoot = () => {
    const now = performance.now();
    if (now - lastShot.current < 180) return;
    if (!shoot()) return;
    lastShot.current = now;

    const origin = camera.position.clone();
    const dir = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .normalize();
    onShoot(origin, dir);
  };

  useEffect(() => {
    (window as any).__gameShoot = tryShoot;
    return () => {
      delete (window as any).__gameShoot;
    };
  });

  useFrame(() => {
    if (!body.current || !gameStarted) return;

    const { forward, backward, left, right, jump, sprint } = getKeys();
    const velocity = body.current.linvel();
    const pos = body.current.translation();
    isGrounded.current = pos.y < 2.5;

    frontVector.current.set(0, 0, Number(backward) - Number(forward));
    sideVector.current.set(Number(left) - Number(right), 0, 0);

    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(SPEED * (sprint ? SPRINT_MULTIPLIER : 1))
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    body.current.setLinvel(
      { x: direction.current.x, y: velocity.y, z: direction.current.z },
      true
    );

    if (jump && isGrounded.current && Math.abs(velocity.y) < 0.6) {
      body.current.setLinvel({ x: velocity.x, y: JUMP_FORCE, z: velocity.z }, true);
    }

    camera.position.set(pos.x, pos.y + 1.55, pos.z);
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 6, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={0.4}
    >
      <CapsuleCollider args={[0.45, 0.35]} position={[0, 0.85, 0]} />
    </RigidBody>
  );
}
