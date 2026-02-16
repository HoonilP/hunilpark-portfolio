'use client';

import {useEffect, useState} from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-950 flex flex-col items-center justify-center">
      <div className="text-white/80 text-sm tracking-[0.2em] uppercase mb-8">
        Loading Lab
      </div>
      <div className="w-48 h-px bg-white/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-white/60 transition-all duration-200"
          style={{width: `${Math.min(progress, 100)}%`}}
        />
      </div>
      <div className="text-white/30 text-xs mt-4">
        {Math.min(Math.round(progress), 100)}%
      </div>
    </div>
  );
}
