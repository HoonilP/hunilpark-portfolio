'use client';

import { Text } from '@react-three/drei';

/**
 * IntroScene — Chapter 0: Developer name and title in 3D text.
 *
 * Positions are RELATIVE to the parent SceneManager group at (0, 0, 0).
 * Uses drei Text component with Pretendard font for Korean text rendering.
 *
 * Requirements: SCENE-01 — Developer identity displayed as 3D text.
 */
export default function IntroScene() {
  return (
    <>
      <ambientLight intensity={0.3} />

      {/* Developer name — Korean, bold, prominent */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.6}
        color="#ffffff"
        font="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/woff/Pretendard-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        박훈일
      </Text>

      {/* Developer title — English, regular weight, muted */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.18}
        color="#888888"
        font="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/woff/Pretendard-Regular.woff"
        anchorX="center"
        anchorY="middle"
      >
        Frontend Developer
      </Text>

      {/* Decorative torus ring around text */}
      <mesh position={[0, 0.4, -0.5]} rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[1.8, 0.005, 16, 64]} />
        <meshBasicMaterial color="#333333" wireframe />
      </mesh>
    </>
  );
}
