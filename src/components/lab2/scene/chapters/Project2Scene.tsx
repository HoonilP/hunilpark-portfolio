'use client';

import { useTexture } from '@react-three/drei';
import TexturePlane from '../shared/TexturePlane';

// Preload hero texture at module level for Suspense-aware caching.
useTexture.preload('/projects/2/hero.webp');

/**
 * Project2Scene — Chapter 2: DY Microfinance CMS (dyCms, projectId=2).
 *
 * Positions are RELATIVE to the parent SceneManager group at (-1, 0, -11).
 * Accent color: cool blue (#4488ff).
 *
 * Requirements: SCENE-02, SCENE-04 — Project scenes with hero texture planes.
 */
export default function Project2Scene() {
  return (
    <>
      <pointLight position={[-2, 2, 1]} intensity={0.3} color="#4488ff" />

      {/* Hero image — main focal plane */}
      <TexturePlane
        url="/projects/2/hero.webp"
        width={3.5}
        height={2.2}
        position={[-0.5, 0.8, 0]}
        rotation={[0, 0.12, 0]}
      />

      {/* Decorative floating dashboard cards — stacked with slight offsets */}
      <mesh position={[2.0, 0.4, -0.3]}>
        <planeGeometry args={[1.2, 0.7]} />
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
      <mesh position={[2.1, 0.25, -0.2]}>
        <planeGeometry args={[1.0, 0.6]} />
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
      <mesh position={[1.9, 0.55, -0.4]}>
        <planeGeometry args={[0.9, 0.5]} />
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
    </>
  );
}
