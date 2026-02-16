'use client';

import {Canvas} from '@react-three/fiber';
import {Environment, Preload} from '@react-three/drei';
import {Suspense, useState, useCallback} from 'react';
import Room from './Room';
import CameraController from './CameraController';
import Hotspot from './Hotspot';
import Lighting from './effects/Lighting';
import LoadingScreen from './ui/LoadingScreen';
import DebugCoords from './DebugCoords';

// Hotspot definitions: position in scaled model space (scale 0.01)
const HOTSPOTS = [
  {
    id: 'about',
    label: 'Door — About',
    position: [-1.48, 1.38, 1.11] as [number, number, number],
    color: '#f59e0b',
    camera: {
      position: [0.79, 1.14, 1.16] as [number, number, number],
      lookAt: [-1.48, 1.38, 1.11] as [number, number, number],
    },
  },
  {
    id: 'projects',
    label: 'Computer — Projects',
    position: [-1.33, 1.04, -0.65] as [number, number, number],
    color: '#3b82f6',
    camera: {
      position: [0.37, 1.15, -0.57] as [number, number, number],
      lookAt: [-1.33, 1.04, -0.65] as [number, number, number],
    },
  },
  {
    id: 'skills',
    label: 'Bed — Skills',
    position: [1.01, 0.34, -1.05] as [number, number, number],
    color: '#10b981',
    camera: {
      position: [-0.02, 1.48, -0.09] as [number, number, number],
      lookAt: [1.01, 0.34, -1.05] as [number, number, number],
    },
  },
  {
    id: 'contact',
    label: 'Cat — Contact',
    position: [0.72, 0.66, -0.28] as [number, number, number],
    color: '#ec4899',
    camera: {
      position: [-0.09, 0.79, -0.46] as [number, number, number],
      lookAt: [0.72, 0.66, -0.28] as [number, number, number],
    },
  },
];

interface LabSceneProps {
  activeSection: string | null;
  onSectionChange: (section: string | null) => void;
  debug?: boolean;
}

export default function LabScene({activeSection, onSectionChange, debug = false}: LabSceneProps) {
  const [ready, setReady] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<{
    position: [number, number, number];
    lookAt: [number, number, number];
  } | null>(null);

  const handleCreated = useCallback(() => {
    setTimeout(() => setReady(true), 500);
  }, []);

  const handleHotspotClick = useCallback((hotspot: typeof HOTSPOTS[0]) => {
    setCameraTarget(hotspot.camera);
    onSectionChange(hotspot.id);
  }, [onSectionChange]);

  const handleResetView = useCallback(() => {
    setCameraTarget({
      position: [0, 3, 5],
      lookAt: [0, 0.5, 0],
    });
    onSectionChange(null);
  }, [onSectionChange]);

  return (
    <>
      {!ready && <LoadingScreen />}
      <div className="w-full h-full" onClick={(e) => {
        // Click on empty space → reset view (only if clicking the canvas background)
        if ((e.target as HTMLElement).tagName === 'CANVAS' && activeSection) {
          handleResetView();
        }
      }}>
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
            {HOTSPOTS.map((hs) => (
              <Hotspot
                key={hs.id}
                position={hs.position}
                label={hs.label}
                color={hs.color}
                active={activeSection === hs.id}
                onClick={() => handleHotspotClick(hs)}
              />
            ))}
            <Environment preset="apartment" environmentIntensity={0.3} />
            <Preload all />
          </Suspense>
          <CameraController target={cameraTarget} />
          {debug && <DebugCoords />}
        </Canvas>
      </div>
    </>
  );
}
