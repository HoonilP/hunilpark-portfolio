'use client';

import {useState, useEffect, useRef} from 'react';
import {useProgress} from '@react-three/drei';

export default function LoadingScreen() {
  const {progress, active, total} = useProgress();
  // When there are no assets to load (total === 0), treat as complete
  const isComplete = !active && (progress >= 99 || total === 0);
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const minTimeReached = useRef(false);
  const fadeScheduled = useRef(false);

  // Minimum display time: 800ms so the percentage is briefly visible
  useEffect(() => {
    const timer = setTimeout(() => {
      minTimeReached.current = true;
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Fade out when loading completes and minimum time has passed
  useEffect(() => {
    if (!isComplete || fadeScheduled.current) return;

    if (minTimeReached.current) {
      fadeScheduled.current = true;
      setOpacity(0);
      setTimeout(() => setVisible(false), 600);
    } else {
      // Loading finished before min time — schedule fade for after 800ms
      const timer = setTimeout(() => {
        if (!fadeScheduled.current) {
          fadeScheduled.current = true;
          setOpacity(0);
          setTimeout(() => setVisible(false), 600);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center"
      style={{opacity, transition: 'opacity 0.6s ease'}}
    >
      <span
        className="text-white/60 font-light tabular-nums"
        style={{fontSize: 'clamp(4rem, 10vw, 8rem)'}}
      >
        {Math.round(progress)}
      </span>
    </div>
  );
}
