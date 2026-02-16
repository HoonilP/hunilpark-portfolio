'use client';

import {useRef} from 'react';
import {Text} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

export default function ContactDesk() {
  const screenGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenGlowRef.current) {
      const material = screenGlowRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={[14, 0, -13]} rotation={[0, -Math.PI / 3, 0]}>
      {/* Desk */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.8, 0.06, 0.9]} />
        <meshStandardMaterial color="#4a3f35" roughness={0.6} />
      </mesh>

      {/* Desk legs */}
      {[[-0.8, 0, -0.35], [-0.8, 0, 0.35], [0.8, 0, -0.35], [0.8, 0, 0.35]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.375, pos[2]]}>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color="#3a3025" roughness={0.7} />
        </mesh>
      ))}

      {/* Monitor stand */}
      <mesh position={[0, 0.88, -0.25]}>
        <boxGeometry args={[0.15, 0.22, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Monitor */}
      <mesh position={[0, 1.25, -0.3]}>
        <boxGeometry args={[1.2, 0.7, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Monitor screen */}
      <mesh ref={screenGlowRef} position={[0, 1.25, -0.275]}>
        <planeGeometry args={[1.1, 0.6]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#1a3a5c"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Screen text */}
      <Text
        fontSize={0.06}
        color="#4a9eff"
        anchorX="center"
        anchorY="middle"
        position={[0, 1.4, -0.27]}
        letterSpacing={0.1}
      >
        GET IN TOUCH
      </Text>

      <Text
        fontSize={0.045}
        color="#8ab4f8"
        anchorX="center"
        anchorY="middle"
        position={[0, 1.28, -0.27]}
      >
        phoonil0927@gmail.com
      </Text>

      <Text
        fontSize={0.045}
        color="#8ab4f8"
        anchorX="center"
        anchorY="middle"
        position={[0, 1.18, -0.27]}
      >
        github.com/HoonilP
      </Text>

      <Text
        fontSize={0.04}
        color="#6a94c8"
        anchorX="center"
        anchorY="middle"
        position={[0, 1.08, -0.27]}
      >
        010-5557-6835
      </Text>

      {/* Section label */}
      <Text
        fontSize={0.1}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        position={[0, 2.5, -0.3]}
        letterSpacing={0.2}
      >
        CONTACT
      </Text>
    </group>
  );
}
