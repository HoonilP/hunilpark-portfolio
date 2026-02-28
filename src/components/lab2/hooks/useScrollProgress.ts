'use client';

import {useRef} from 'react';
import {useLenis} from 'lenis/react';

/**
 * useScrollProgress — bridges Lenis DOM scroll to R3F via a mutable ref.
 *
 * Returns a ref containing the animated scroll progress (0-1) from Lenis.
 * Uses useRef (not useState) so updates don't trigger React re-renders —
 * the value is consumed directly inside R3F useFrame callbacks each tick.
 *
 * Pattern: "애니메이션 값은 useRef" (STATE.md decision)
 */
export function useScrollProgress(): React.MutableRefObject<number> {
  const progressRef = useRef(0);

  useLenis(({progress}) => {
    progressRef.current = progress;
  });

  return progressRef;
}
