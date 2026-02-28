'use client';

import {useRef} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {useScrollProgress} from '../hooks/useScrollProgress';
import {CHAPTERS, getChapterIndex, CHAPTER_COUNT} from '../config/chapters';

/**
 * Gentle camera lag factor — Lenis already smooths scroll input, adding 0.05
 * lerp on top produces cinematic delay without feeling sluggish. Sweet spot: 0.03–0.08.
 */
const LERP_FACTOR = 0.05;

/**
 * CameraRig — pure logic component (renders null) that drives camera interpolation.
 *
 * Reads scroll progress (0-1) from useScrollProgress ref each frame, computes
 * the interpolated position and lookAt between adjacent chapter waypoints, and
 * applies a secondary lerp for camera lag. Both position AND lookAt are lerped
 * separately to prevent snap at chapter boundaries (research pitfall 5).
 *
 * Must be mounted inside a Canvas so useFrame and useThree are available.
 */
export default function CameraRig() {
  const {camera} = useThree();
  const progressRef = useScrollProgress();

  // Reusable Vector3 refs — allocated once, mutated every frame (no GC pressure)
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  // Initialize currentLookAt to chapter 0's lookAt so there's no initial snap on mount
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const progress = progressRef.current;
    const idx = getChapterIndex(progress);
    const nextIdx = Math.min(idx + 1, CHAPTER_COUNT - 1);

    // Local t within current chapter (0-1)
    const chapterStart = idx / CHAPTER_COUNT;
    const t = Math.min((progress - chapterStart) * CHAPTER_COUNT, 1);

    // Compute interpolated targets between current and next waypoint
    targetPos.current.lerpVectors(CHAPTERS[idx].position, CHAPTERS[nextIdx].position, t);
    targetLookAt.current.lerpVectors(CHAPTERS[idx].lookAt, CHAPTERS[nextIdx].lookAt, t);

    // Smooth camera toward targets (gentle lag on top of Lenis smoothing)
    camera.position.lerp(targetPos.current, LERP_FACTOR);
    currentLookAt.current.lerp(targetLookAt.current, LERP_FACTOR);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
