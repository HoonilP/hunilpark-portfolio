'use client';

import {useRef, useState} from 'react';
import {useFrame} from '@react-three/fiber';
import {Html} from '@react-three/drei';
import * as THREE from 'three';

interface HotspotProps {
  position: [number, number, number];
  label: string;
  color?: string;
  onClick: () => void;
  active?: boolean;
}

export default function Hotspot({position, label, color = '#4a9eff', onClick, active}: HotspotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(active ? 1.3 : hovered ? 1.15 : 1);
    }
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.15);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Pulsing ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Label */}
      <Html
        position={[0, 0.18, 0]}
        center
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <div className={`px-2 py-1 rounded text-xs font-medium transition-all ${
          hovered || active
            ? 'bg-white/20 text-white backdrop-blur-sm'
            : 'bg-transparent text-white/50'
        }`}>
          {label}
        </div>
      </Html>
    </group>
  );
}
