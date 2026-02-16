'use client';

import {useRef} from 'react';
import {useThree, useFrame} from '@react-three/fiber';
import * as THREE from 'three';

const WAYPOINTS = [
  {position: [0, 3, 5], lookAt: [0, 0.5, 0]},                       // Overview
  {position: [0.79, 1.14, 1.16], lookAt: [-1.48, 1.38, 1.11]},      // Door (About)
  {position: [0.37, 1.15, -0.57], lookAt: [-1.33, 1.04, -0.65]},    // Computer (Projects)
  {position: [-0.02, 1.48, -0.09], lookAt: [1.01, 0.34, -1.05]},    // Bed (Skills)
  {position: [-0.09, 0.79, -0.46], lookAt: [0.72, 0.66, -0.28]},    // Cat (Contact)
].map((w) => ({
  position: new THREE.Vector3(...(w.position as [number, number, number])),
  lookAt: new THREE.Vector3(...(w.lookAt as [number, number, number])),
}));

interface CameraRigProps {
  scrollProgress: number;
}

export default function CameraRig({scrollProgress}: CameraRigProps) {
  const {camera} = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0.5, 0));
  const targetPos = useRef(new THREE.Vector3(0, 3, 5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.5, 0));

  useFrame(() => {
    const segments = WAYPOINTS.length - 1;
    const raw = scrollProgress * segments;
    const idx = Math.min(Math.floor(raw), segments - 1);
    const t = Math.min(raw - idx, 1);

    const from = WAYPOINTS[idx];
    const to = WAYPOINTS[Math.min(idx + 1, WAYPOINTS.length - 1)];

    targetPos.current.lerpVectors(from.position, to.position, t);
    targetLookAt.current.lerpVectors(from.lookAt, to.lookAt, t);

    camera.position.lerp(targetPos.current, 0.08);
    currentLookAt.current.lerp(targetLookAt.current, 0.08);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
