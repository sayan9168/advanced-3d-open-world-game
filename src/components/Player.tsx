"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, CapsuleCollider, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

const SPEED = 8;
const SPRINT_MULTIPLIER = 1.8;
const JUMP_FORCE = 8;

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();
  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());
  const isGrounded = useRef(true);

  const yaw = useRef(0);
  const pitch = useRef(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yaw.current -= e.movementX * 0.002;
        pitch.current -= e.movementY * 0.002;
        pitch.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitch.current));
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame(() => {
    if (!body.current) return;

    const { forward, backward, left, right, jump, sprint } = getKeys();
    const velocity = body.current.linvel();

    const pos = body.current.translation();
    isGrounded.current = pos.y < 2.2;

    frontVector.current.set(0, 0, Number(backward) - Number(forward));
    sideVector.current.set(Number(left) - Number(right), 0, 0);

    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(SPEED * (sprint ? SPRINT_MULTIPLIER : 1))
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    body.current.setLinvel(
      {
        x: direction.current.x,
        y: velocity.y,
        z: direction.current.z,
      },
      true
    );

    if (jump && isGrounded.current && Math.abs(velocity.y) < 0.5) {
      body.current.setLinvel(
        { x: velocity.x, y: JUMP_FORCE, z: velocity.z },
        true
      );
    }

    const camOffset = new THREE.Vector3(0, 1.6, 0);
    camera.position.set(pos.x + camOffset.x, pos.y + camOffset.y, pos.z + camOffset.z);
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
      position={[0, 5, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={0.5}
    >
      <CapsuleCollider args={[0.5, 0.4]} position={[0, 0.9, 0]} />
      <mesh castShadow position={[0, 0.9, 0]} visible={false}>
        <capsuleGeometry args={[0.4, 1, 8, 16]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
    </RigidBody>
  );
}
