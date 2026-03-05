'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

interface EyeFollowButtonProps {
  label: string;
  onClick: () => void;
  isOpen: boolean;
}

function Eye({ parentRef }: { parentRef: React.RefObject<HTMLButtonElement | null> }) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilX = useSpring(0, { bounce: 0.2, duration: 0.4 });
  const pupilY = useSpring(0, { bounce: 0.2, duration: 0.4 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxMove = 4;
      const clamp = Math.min(dist, 80) / 80;
      pupilX.set((dx / (dist || 1)) * maxMove * clamp);
      pupilY.set((dy / (dist || 1)) * maxMove * clamp);
    },
    [pupilX, pupilY]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={eyeRef}
      className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 dark:bg-white"
    >
      <motion.div
        className="h-3.5 w-3.5 rounded-full bg-white dark:bg-slate-900"
        style={{ x: pupilX, y: pupilY }}
      />
    </div>
  );
}

export default function EyeFollowButton({ label, onClick, isOpen }: EyeFollowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-6 py-3 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/80"
    >
      <span className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
        {label}
      </span>
      <div className="flex gap-1.5">
        <Eye parentRef={buttonRef} />
        <Eye parentRef={buttonRef} />
      </div>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-slate-500 dark:text-slate-400"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5">
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.span>
    </button>
  );
}
