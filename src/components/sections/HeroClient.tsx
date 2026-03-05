'use client';

import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';

const FluidSimulation = dynamic(() => import('@/components/effects/FluidSimulation'), { ssr: false });

interface HeroClientProps {
  titleLine1: string;
  titleAccent: string;
  subtitle: string;
  scrollText: string;
}

export default function HeroClient({
  titleLine1,
  titleAccent,
  subtitle,
  scrollText,
}: HeroClientProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const fluidColor = isDark ? 'rgba(120, 200, 255, 0.85)' : 'rgba(6, 100, 220, 0.7)';

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 -z-30 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.7) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(6, 127, 249, 0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Fluid Simulation */}
      <div className="absolute inset-0 z-0 pointer-events-auto" aria-hidden="true">
        <FluidSimulation
          particleCount={5000}
          particleColor={fluidColor}
          penSize={50}
          resolution={10}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl space-y-8 pointer-events-none">
        {/* Title */}
        <div className="hero-reveal-wrap">
          <h1 className="hero-reveal hero-reveal-delay-1 text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white md:text-7xl lg:text-8xl">
            {titleLine1}
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
              {titleAccent}
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div className="hero-reveal-wrap">
            <p className="hero-reveal hero-reveal-delay-2 mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed md:text-xl">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="hero-reveal-wrap absolute bottom-8">
        <div className="hero-reveal hero-reveal-delay-5 scroll-indicator flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
          <ChevronDown className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest">{scrollText}</span>
        </div>
      </div>
    </section>
  );
}
