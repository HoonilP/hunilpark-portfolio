'use client';

import {useRef, useEffect, useCallback} from 'react';
import {useThree, useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * Model bbox: X(-20~17), Y(0~3.1), Z(-18~19.6)
 * Center roughly (-1.5, 1.5, 0.9)
 * Camera path designed to tour through the room space.
 */
const WAYPOINTS = [
  // 0% — Entrance / Hero (front of room, looking inward)
  {pos: [0, 1.6, 18], look: [0, 1.5, 10]},
  // 25% — Left wall area / Projects
  {pos: [-12, 1.6, 5], look: [-18, 1.6, 0]},
  // 50% — Center of room / Skills
  {pos: [0, 1.8, -2], look: [0, 1.2, -10]},
  // 75% — Right side / Contact
  {pos: [10, 1.6, -10], look: [15, 1.4, -14]},
  // 100% — Bird's eye overview
  {pos: [0, 8, 2], look: [0, 0, -2]},
] as const;

export default function CameraRig() {
  const {camera} = useThree();
  const progressRef = useRef(0);
  const targetPos = useRef(new THREE.Vector3(...WAYPOINTS[0].pos));
  const targetLook = useRef(new THREE.Vector3(...WAYPOINTS[0].look));
  const currentPos = useRef(new THREE.Vector3(...WAYPOINTS[0].pos));
  const currentLook = useRef(new THREE.Vector3(...WAYPOINTS[0].look));
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const updateSectionDots = useCallback((progress: number) => {
    const dots = document.querySelectorAll('.section-dot');
    const sectionIndex = Math.round(progress * (WAYPOINTS.length - 1));
    dots.forEach((dot, i) => {
      const el = dot as HTMLElement;
      if (i === Math.min(sectionIndex, dots.length - 1)) {
        el.style.background = 'rgba(255,255,255,0.9)';
        el.style.transform = 'scale(1.5)';
      } else {
        el.style.background = 'rgba(255,255,255,0.3)';
        el.style.transform = 'scale(1)';
      }
    });

    const hint = document.getElementById('scroll-hint');
    if (hint && progress > 0.02) {
      hint.style.opacity = '0';
    }
  }, []);

  useEffect(() => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;overflow-y:auto;z-index:65;';
    const spacer = document.createElement('div');
    spacer.style.height = '500vh';
    spacer.style.pointerEvents = 'none';
    container.appendChild(spacer);
    document.body.appendChild(container);
    scrollContainerRef.current = container;

    container.addEventListener('click', (e) => {
      if (e.target === container) {
        container.style.pointerEvents = 'none';
        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        if (el) el.click();
        container.style.pointerEvents = 'auto';
      }
    });

    const onScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const progress = maxScroll > 0 ? container.scrollTop / maxScroll : 0;
      progressRef.current = Math.max(0, Math.min(1, progress));

      const totalSegments = WAYPOINTS.length - 1;
      const segment = progress * totalSegments;
      const index = Math.min(Math.floor(segment), totalSegments - 1);
      const t = segment - index;

      const from = WAYPOINTS[index];
      const to = WAYPOINTS[index + 1];

      // smoothstep
      const eased = t * t * (3 - 2 * t);

      targetPos.current.set(
        from.pos[0] + (to.pos[0] - from.pos[0]) * eased,
        from.pos[1] + (to.pos[1] - from.pos[1]) * eased,
        from.pos[2] + (to.pos[2] - from.pos[2]) * eased,
      );

      targetLook.current.set(
        from.look[0] + (to.look[0] - from.look[0]) * eased,
        from.look[1] + (to.look[1] - from.look[1]) * eased,
        from.look[2] + (to.look[2] - from.look[2]) * eased,
      );

      updateSectionDots(progress);
    };

    container.addEventListener('scroll', onScroll, {passive: true});

    return () => {
      container.removeEventListener('scroll', onScroll);
      document.body.removeChild(container);
    };
  }, [updateSectionDots]);

  useFrame(() => {
    currentPos.current.lerp(targetPos.current, 0.06);
    currentLook.current.lerp(targetLook.current, 0.06);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      camera.position,
      {x: 0, y: 3, z: 24},
      {
        x: WAYPOINTS[0].pos[0],
        y: WAYPOINTS[0].pos[1],
        z: WAYPOINTS[0].pos[2],
        duration: 2.5,
        ease: 'power2.out',
      },
    );
  }, [camera]);

  return null;
}
