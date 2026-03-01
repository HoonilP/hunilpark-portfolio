'use client';

import {Canvas} from '@react-three/fiber';
import {Preload} from '@react-three/drei';
import {Suspense} from 'react';
import LoadingScreen from './ui/LoadingScreen';
import CameraRig from './scene/CameraRig';
import SceneManager from './scene/SceneManager';
import ParticleField from './scene/ParticleField';

export default function Lab2Scene() {
  return (
    <>
      <LoadingScreen />
      <Canvas
        camera={{fov: 50, position: [0, 2, 5], near: 0.01, far: 100}}
        gl={{antialias: true, alpha: false}}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#080808']} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} />
          <CameraRig />
          <SceneManager />
          <ParticleField />
          <Preload all />
        </Suspense>
      </Canvas>
    </>
  );
}
