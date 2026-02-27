'use client';

import {useState, useEffect, useRef} from 'react';
import {useProgress} from '@react-three/drei';

export default function LoadingScreen() {
  const {progress, active} = useProgress();
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const minTimeReached = useRef(false);
  const fadeScheduled = useRef(false);

  // Minimum display time: 800ms so the percentage is briefly visible
  useEffect(() => {
    const timer = setTimeout(() => {
      minTimeReached.current = true;
      // If loading already finished before minimum time, start fade now
      if (!active && progress >= 99 && !fadeScheduled.current) {
        fadeScheduled.current = true;
        setOpacity(0);
        setTimeout(() => setVisible(false), 600);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Fade out when loading completes and minimum time has passed
  useEffect(() => {
    if (!active && progress >= 99 && minTimeReached.current && !fadeScheduled.current) {
      fadeScheduled.current = true;
      setOpacity(0);
      setTimeout(() => setVisible(false), 600);
    }
  }, [active, progress]);

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
