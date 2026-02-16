'use client';

import {useRef} from 'react';
import {Text} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

export default function HeroStation() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 1.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  return (
    <group position={[0, 0, 12]}>
      {/* Floating text group */}
      <group ref={groupRef} position={[0, 1.6, 0]}>
        <Text
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.4, 0]}
          letterSpacing={0.12}
        >
          HUNIL PARK
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </Text>

        <Text
          fontSize={0.15}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.1, 0]}
          letterSpacing={0.2}
        >
          FRONTEND DEVELOPER
        </Text>

        <Text
          fontSize={0.1}
          color="#666666"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.4, 0]}
          letterSpacing={0.08}
          maxWidth={5}
          textAlign="center"
        >
          Crafting clean and refined web experiences
        </Text>
      </group>

      {/* Floor spotlight glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.04}
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
