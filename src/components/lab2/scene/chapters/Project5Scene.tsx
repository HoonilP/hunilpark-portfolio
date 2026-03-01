'use client';

import { useTexture } from '@react-three/drei';
import TexturePlane from '../shared/TexturePlane';

// Preload hero texture at module level for Suspense-aware caching.
useTexture.preload('/projects/5/hero.webp');

/**
 * Project5Scene — Chapter 5: Dino Go (dinoGo, projectId=5).
 *
 * Positions are RELATIVE to the parent SceneManager group at (0, 0, -29).
 * Accent color: violet (#8866ff) — game / blockchain gem aesthetic.
 *
 * Requirements: SCENE-02, SCENE-04 — Project scenes with hero texture planes.
 */
export default function Project5Scene() {
  return (
    <>
      <pointLight position={[-1, 2, 2]} intensity={0.3} color="#8866ff" />

      {/* Hero image — main focal plane */}
      <TexturePlane
        url="/projects/5/hero.webp"
        width={3.5}
        height={2.2}
        position={[-0.3, 0.8, 0]}
        rotation={[0, 0.1, 0]}
      />

      {/* Decorative dodecahedron — gem-like blockchain shape */}
      <mesh position={[2, 0.6, 0.5]}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial color="#8844ff" wireframe />
      </mesh>
    </>
  );
}
