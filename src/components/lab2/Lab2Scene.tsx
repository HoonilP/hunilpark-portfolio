'use client';

import {Canvas} from '@react-three/fiber';
import {Preload} from '@react-three/drei';
import {Suspense} from 'react';
import LoadingScreen from './ui/LoadingScreen';
import EmptyScene from './EmptyScene';

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
          <EmptyScene />
          <Preload all />
        </Suspense>
      </Canvas>
    </>
  );
}
