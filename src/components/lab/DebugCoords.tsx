'use client';

import {useState, useRef, useEffect} from 'react';
import {useThree, useFrame} from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Debug tool: click anywhere on the 3D model to get exact coordinates.
 * Shows clicked position + current camera position.
 * Logs to console for easy copy-paste.
 */
export default function DebugCoords() {
  const {camera, scene, gl} = useThree();
  const [clickedPoint, setClickedPoint] = useState<THREE.Vector3 | null>(null);
  const [camInfo, setCamInfo] = useState('');
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useFrame(() => {
    setCamInfo(`cam: (${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)})`);
  });

  useEffect(() => {
    const canvas = gl.domElement;

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const pt = intersects[0].point;
        setClickedPoint(pt.clone());

        const pos = `${pt.x.toFixed(2)}, ${pt.y.toFixed(2)}, ${pt.z.toFixed(2)}`;
        const cam = `${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}`;
        console.log(`%c CLICK `, 'background:#3b82f6;color:#fff;font-weight:bold',
          `\n  point: [${pos}]`,
          `\n  camera: [${cam}]`,
          `\n  mesh: ${intersects[0].object.name || '(unnamed)'}`,
        );
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [camera, scene, gl]);

  return (
    <>
      {/* Clicked point marker */}
      {clickedPoint && (
        <mesh position={clickedPoint}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      )}
    </>
  );
}
