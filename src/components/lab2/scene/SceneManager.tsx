'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { getChapterIndex } from '../config/chapters';

const CHAPTER_COUNT = 6;

// Scene group focal centers — match lookAt targets from chapters.ts waypoints.
// Plan 02 will replace placeholder meshes with actual scene components.
const GROUP_POSITIONS: [number, number, number][] = [
  [0, 0, 0],    // Chapter 0: intro, lookAt(0, 0.5, 0)
  [1, 0, -5],   // Chapter 1: project-1, lookAt(1, 0.5, -5)
  [-1, 0, -11], // Chapter 2: project-2, lookAt(-1, 0.5, -11)
  [0, 0, -17],  // Chapter 3: project-3, lookAt(0, 0.5, -17)
  [0, 0, -23],  // Chapter 4: project-4, lookAt(0, 0.5, -23)
  [0, 0, -29],  // Chapter 5: project-5, lookAt(0, 0.5, -29)
];

// Development placeholder colors — one per chapter group for easy identification.
const PLACEHOLDER_COLORS = [
  '#ffffff', // Chapter 0: intro — white
  '#ff6666', // Chapter 1: artWar — red
  '#66aaff', // Chapter 2: dyCms — blue
  '#66ffaa', // Chapter 3: joshua — green
  '#ffcc44', // Chapter 4: retailAnalysis — yellow
  '#cc66ff', // Chapter 5: dinoGo — purple
];

/**
 * SceneManager — Visibility-toggle scene manager.
 *
 * Mounts all 6 chapter scene groups unconditionally. Reads scroll progress each
 * frame and sets group.visible to show only the active chapter. This avoids the
 * shader recompilation stutter caused by conditional mounting/unmounting.
 *
 * Pattern: "단일 Canvas 생존 패턴" (STATE.md) — never conditionally render R3F geometry.
 *
 * Plan 02 will replace the placeholder <mesh> inside each group with actual
 * IntroScene, Project1Scene, etc. components.
 */
export default function SceneManager() {
  const progressRef = useScrollProgress();
  const groupRefs = useRef<(THREE.Group | null)[]>(Array(CHAPTER_COUNT).fill(null));

  useFrame(() => {
    const chapterIdx = getChapterIndex(progressRef.current);
    groupRefs.current.forEach((group, i) => {
      if (group) group.visible = i === chapterIdx;
    });
  });

  return (
    <>
      {GROUP_POSITIONS.map((pos, i) => (
        <group
          key={i}
          position={pos}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
        >
          {/* Placeholder mesh — replaced in Plan 02 with actual scene components */}
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial color={PLACEHOLDER_COLORS[i]} />
          </mesh>
        </group>
      ))}
    </>
  );
}
