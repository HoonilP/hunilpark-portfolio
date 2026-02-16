'use client';

import {Canvas} from '@react-three/fiber';
import {Environment, Preload} from '@react-three/drei';
import {Suspense, useState, useCallback} from 'react';
import Room from './Room';
import CameraRig from './CameraRig';
import Lighting from './effects/Lighting';
import LoadingScreen from './ui/LoadingScreen';
import DebugCoords from './DebugCoords';

interface LabSceneProps {
  scrollProgress: number;
  debug?: boolean;
}

export default function LabScene({scrollProgress, debug = false}: LabSceneProps) {
  const [ready, setReady] = useState(false);

  const handleCreated = useCallback(() => {
    setTimeout(() => setReady(true), 500);
  }, []);

  return (
    <>
      {!ready && <LoadingScreen />}
      <Canvas
        camera={{fov: 50, position: [0, 3, 5], near: 0.01, far: 100}}
        onCreated={handleCreated}
        gl={{antialias: true, alpha: false}}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 15, 40]} />
        <Suspense fallback={null}>
          <Lighting />
          <Room />
          <Environment preset="apartment" environmentIntensity={0.3} />
          <Preload all />
        </Suspense>
        <CameraRig scrollProgress={scrollProgress} />
        {debug && <DebugCoords />}
      </Canvas>
    </>
  );
}
