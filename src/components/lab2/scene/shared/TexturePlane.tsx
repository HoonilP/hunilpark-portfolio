'use client';

import { useTexture } from '@react-three/drei';

interface TexturePlaneProps {
  /** URL of the WebP/image texture to display. */
  url: string;
  /** Plane width in world units. Default 3.2 (16:10 aspect numerator). */
  width?: number;
  /** Plane height in world units. Default 2 (16:10 aspect denominator). */
  height?: number;
  /** 3D position [x, y, z]. Default [0, 0, 0]. */
  position?: [number, number, number];
  /** Euler rotation [x, y, z] in radians. Default [0, 0, 0]. */
  rotation?: [number, number, number];
}

/**
 * TexturePlane — Reusable texture plane for displaying project images in 3D space.
 *
 * Uses useTexture from drei for Suspense-aware texture loading with URL-based caching.
 * meshBasicMaterial is unlit — correct for portfolio image display (no lighting needed).
 * Default aspect ratio 3.2:2 (16:10) matches typical portfolio screenshot dimensions.
 *
 * Must be used inside a <Suspense> boundary (already present in Lab2Scene).
 *
 * Requirements: SCENE-04 — WebP images displayed as 3D texture planes.
 */
export default function TexturePlane({
  url,
  width = 3.2,
  height = 2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: TexturePlaneProps) {
  const texture = useTexture(url);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}
