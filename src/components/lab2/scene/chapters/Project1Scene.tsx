'use client';

import { useTexture } from '@react-three/drei';
import TexturePlane from '../shared/TexturePlane';

// Preload hero texture at module level for Suspense-aware caching.
useTexture.preload('/projects/6/hero.webp');

/**
 * Project1Scene — Chapter 1: Ministry of Truth (artWar, projectId=6).
 *
 * Positions are RELATIVE to the parent SceneManager group at (1, 0, -5).
 * Accent color: warm orange-red (#ff6644).
 *
 * Requirements: SCENE-02, SCENE-04 — Project scenes with hero texture planes.
 */
export default function Project1Scene() {
  return (
    <>
      <pointLight position={[2, 2, 2]} intensity={0.3} color="#ff6644" />

      {/* Hero image — main focal plane */}
      <TexturePlane
        url="/projects/6/hero.webp"
        width={3.5}
        height={2.2}
        position={[0.5, 0.8, 0]}
        rotation={[0, -0.15, 0]}
      />

      {/* Decorative floating boxes — scattered around the image */}
      <mesh position={[-1.8, 1.4, 0.6]} rotation={[0.3, 0.5, 0.2]}>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshBasicMaterial color="#444444" wireframe />
      </mesh>
      <mesh position={[2.4, 0.3, 0.8]} rotation={[0.1, 0.8, 0.4]}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshBasicMaterial color="#444444" wireframe />
      </mesh>
      <mesh position={[-1.2, -0.5, 1.0]} rotation={[0.6, 0.2, 0.1]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshBasicMaterial color="#444444" wireframe />
      </mesh>
    </>
  );
}
