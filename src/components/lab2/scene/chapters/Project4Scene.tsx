'use client';

import { useTexture } from '@react-three/drei';
import TexturePlane from '../shared/TexturePlane';

// Preload hero texture at module level for Suspense-aware caching.
useTexture.preload('/projects/3/hero.webp');

/**
 * Project4Scene — Chapter 4: Retail Store Analysis (retailAnalysis, projectId=3).
 *
 * Positions are RELATIVE to the parent SceneManager group at (0, 0, -23).
 * Accent color: warm orange (#ff8844) — retail / heatmap tracking.
 *
 * Requirements: SCENE-02, SCENE-04 — Project scenes with hero texture planes.
 */
export default function Project4Scene() {
  return (
    <>
      <pointLight position={[1, 2, 2]} intensity={0.3} color="#ff8844" />

      {/* Hero image — main focal plane */}
      <TexturePlane
        url="/projects/3/hero.webp"
        width={3.5}
        height={2.2}
        position={[0.3, 0.8, 0]}
        rotation={[0, -0.1, 0]}
      />

      {/* Decorative data point spheres — scattered tracking dots */}
      <mesh position={[-2.0, 1.6, 0.8]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ff8844" />
      </mesh>
      <mesh position={[2.3, 0.2, 1.0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ff8844" />
      </mesh>
      <mesh position={[-1.4, -0.4, 0.6]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ff8844" />
      </mesh>
    </>
  );
}
