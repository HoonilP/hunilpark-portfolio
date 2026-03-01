'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 2000;

/**
 * ParticleField — Ambient particle system providing spatial depth across the full camera path.
 *
 * Renders 2000 points distributed across the 3D volume that encompasses all 6 chapters.
 * Lives OUTSIDE SceneManager — always visible regardless of active chapter.
 *
 * Volume: x(-15, 15), y(-5, 5), z(5, -35) covers chapters 0 through 5.
 * Positions generated once with useMemo — never recreated in render or useFrame.
 * Gentle y-axis rotation (0.003 rad/s) adds subtle life without being distracting.
 *
 * Requirements: SCENE-03 — particle field providing spatial depth (≤3k particles).
 */
export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate particle positions once — useMemo prevents recreation on re-render.
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // x: -15 to 15 (full horizontal spread)
      arr[i * 3] = (Math.random() - 0.5) * 30;
      // y: -5 to 5 (vertical spread around camera path)
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      // z: 5 to -35 (covers entire camera path from chapter 0 to chapter 5)
      arr[i * 3 + 2] = 5 - Math.random() * 40;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#6666cc"
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
}
