'use client';

import { useTexture } from '@react-three/drei';
import TexturePlane from '../shared/TexturePlane';

// Preload both textures at module level for Suspense-aware caching.
useTexture.preload('/projects/1/hero.webp');
useTexture.preload('/projects/1/architecture.webp');

/**
 * Project3Scene — Chapter 3: Joshua AI Agent (joshua, projectId=1).
 *
 * Positions are RELATIVE to the parent SceneManager group at (0, 0, -17).
 * Accent color: green (#44cc66) — AI / natural intelligence.
 *
 * Requirements: SCENE-02, SCENE-04 — Project scenes with hero texture planes.
 */
export default function Project3Scene() {
  return (
    <>
      <pointLight position={[0, 3, 2]} intensity={0.3} color="#44cc66" />

      {/* Primary hero image */}
      <TexturePlane
        url="/projects/1/hero.webp"
        width={3.5}
        height={2.2}
        position={[0, 0.8, 0.3]}
        rotation={[0, 0, 0]}
      />

      {/* Secondary architecture diagram — smaller, offset to the right */}
      <TexturePlane
        url="/projects/1/architecture.webp"
        width={2}
        height={1.3}
        position={[2.2, 0.5, 0.8]}
        rotation={[0, -0.3, 0.02]}
      />

      {/* Decorative icosahedron — represents AI / neural network */}
      <mesh position={[-2, 1.2, 0.5]}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshBasicMaterial color="#44ff88" wireframe />
      </mesh>
    </>
  );
}
