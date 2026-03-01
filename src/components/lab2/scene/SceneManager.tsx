'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { getChapterIndex } from '../config/chapters';
import IntroScene from './chapters/IntroScene';
import Project1Scene from './chapters/Project1Scene';
import Project2Scene from './chapters/Project2Scene';
import Project3Scene from './chapters/Project3Scene';
import Project4Scene from './chapters/Project4Scene';
import Project5Scene from './chapters/Project5Scene';

const CHAPTER_COUNT = 6;

// Scene group focal centers — match lookAt targets from chapters.ts waypoints.
const GROUP_POSITIONS: [number, number, number][] = [
  [0, 0, 0],    // Chapter 0: intro, lookAt(0, 0.5, 0)
  [1, 0, -5],   // Chapter 1: project-1, lookAt(1, 0.5, -5)
  [-1, 0, -11], // Chapter 2: project-2, lookAt(-1, 0.5, -11)
  [0, 0, -17],  // Chapter 3: project-3, lookAt(0, 0.5, -17)
  [0, 0, -23],  // Chapter 4: project-4, lookAt(0, 0.5, -23)
  [0, 0, -29],  // Chapter 5: project-5, lookAt(0, 0.5, -29)
];

// Scene components ordered by chapter index.
const SCENES = [
  IntroScene,
  Project1Scene,
  Project2Scene,
  Project3Scene,
  Project4Scene,
  Project5Scene,
];

/**
 * SceneManager — Visibility-toggle scene manager.
 *
 * Mounts all 6 chapter scene groups unconditionally. Reads scroll progress each
 * frame and sets group.visible to show only the active chapter. This avoids the
 * shader recompilation stutter caused by conditional mounting/unmounting.
 *
 * Pattern: "단일 Canvas 생존 패턴" (STATE.md) — never conditionally render R3F geometry.
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
      {SCENES.map((SceneComponent, i) => (
        <group
          key={i}
          position={GROUP_POSITIONS[i]}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
        >
          <SceneComponent />
        </group>
      ))}
    </>
  );
}
