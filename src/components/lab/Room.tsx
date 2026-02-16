'use client';

import {useGLTF} from '@react-three/drei';
import {useRef} from 'react';
import * as THREE from 'three';

/**
 * Room model loaded from .glb.
 * Original bbox: X(-170~150), Y(-20~240), Z(-197~175) (centimeters)
 * Scaled 0.01 → X(-1.7~1.5), Y(-0.2~2.4), Z(-1.97~1.75) (meters)
 */
export default function Room() {
  const {scene} = useGLTF('/models/room.glb');
  const groupRef = useRef<THREE.Group>(null);

  return (
    <primitive
      ref={groupRef}
      object={scene}
      scale={0.01}
      position={[0, 0, 0]}
    />
  );
}

useGLTF.preload('/models/room.glb');
