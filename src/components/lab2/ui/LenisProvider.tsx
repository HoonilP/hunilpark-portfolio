'use client';

import 'lenis/dist/lenis.css';
import {useRef, useEffect} from 'react';
import {ReactLenis} from 'lenis/react';
import type {LenisRef} from 'lenis/react';
import {addEffect} from '@react-three/fiber';

interface LenisProviderProps {
  children: React.ReactNode;
}

/**
 * LenisProvider — wraps /lab2 page with Lenis smooth scroll.
 *
 * Key implementation decisions (see 07-RESEARCH.md):
 * 1. autoRaf: false — Lenis must NOT run its own RAF. R3F drives Lenis via
 *    addEffect so both share the same animation frame (single RAF). Dual RAF
 *    causes ~40fps drops and scroll/render desync.
 * 2. addEffect drives lenisRef.current.lenis.raf(t) each R3F frame — this
 *    keeps Lenis animated progress in sync with the WebGL render loop.
 * 3. lerp: 0.08, duration: 1.2 — elastic inertial feel matching design intent.
 */
export default function LenisProvider({children}: LenisProviderProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const cleanup = addEffect((t) => {
      lenisRef.current?.lenis?.raf(t);
    });
    return cleanup;
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{autoRaf: false, lerp: 0.08, duration: 1.2}}
    >
      {children}
    </ReactLenis>
  );
}
