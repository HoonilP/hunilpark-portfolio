'use client';

import {useRef, useEffect} from 'react';
import {useThree, useFrame} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface CameraControllerProps {
  target: {
    position: [number, number, number];
    lookAt: [number, number, number];
  } | null;
  onArrived?: () => void;
}

export default function CameraController({target, onArrived}: CameraControllerProps) {
  const {camera} = useThree();
  const controlsRef = useRef<any>(null);
  const isAnimating = useRef(false);

  // Animate camera to target when it changes
  useEffect(() => {
    if (!target || !controlsRef.current) return;

    isAnimating.current = true;
    controlsRef.current.enabled = false;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        if (controlsRef.current) {
          controlsRef.current.target.set(...target.lookAt);
          controlsRef.current.enabled = true;
          controlsRef.current.update();
        }
        onArrived?.();
      },
    });

    tl.to(camera.position, {
      x: target.position[0],
      y: target.position[1],
      z: target.position[2],
      duration: 1.5,
      ease: 'power2.inOut',
    }, 0);

    // Animate orbit controls target (lookAt)
    if (controlsRef.current) {
      tl.to(controlsRef.current.target, {
        x: target.lookAt[0],
        y: target.lookAt[1],
        z: target.lookAt[2],
        duration: 1.5,
        ease: 'power2.inOut',
      }, 0);
    }

    return () => {
      tl.kill();
    };
  }, [target, camera, onArrived]);

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      camera.position,
      {x: 0, y: 5, z: 10},
      {x: 0, y: 3, z: 5, duration: 2, ease: 'power2.out'},
    );
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={0.5}
      maxDistance={20}
      maxPolarAngle={Math.PI * 0.9}
      minPolarAngle={0.1}
      target={[0, 0.5, 0]}
      panSpeed={1.5}
      dampingFactor={0.08}
      enableDamping
    />
  );
}
