'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export interface CarouselProject {
  id: string;
  title: string;
  description: string;
  period: string;
  techStack: string[];
  image: string;
}

interface ReelCarouselProps {
  projects: CarouselProject[];
  viewDetailsLabel: string;
}

const INTERVAL = 4000;

export default function ReelCarousel({ projects, viewDetailsLabel }: ReelCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % projects.length);
    setProgress(0);
  }, [projects.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length);
    setProgress(0);
  }, [projects.length]);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    setProgress(0);
    const step = 50;

    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (step / INTERVAL) * 100, 100));
    }, step);

    timerRef.current = setInterval(next, INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, isPaused, next]);

  const project = projects[current];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Link href={`/projects/${project.id}`} className="block h-full">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                quality={75}
                className="object-cover"
                priority={current === 0}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                    {project.period}
                  </p>
                  <h3 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                    {project.title}
                  </h3>
                  <p className="max-w-xl text-sm text-slate-300 leading-relaxed line-clamp-2 md:text-base">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={(e) => { e.preventDefault(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60"
          aria-label="Previous project"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60"
          aria-label="Next project"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress bars */}
      <div className="mt-4 flex gap-2">
        {projects.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setCurrent(i); setProgress(0); }}
            className="group relative h-1 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
            aria-label={`Go to project ${i + 1}`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-blue-500 transition-all"
              style={{
                width: i === current ? `${progress}%` : i < current ? '100%' : '0%',
                transition: i === current ? 'width 50ms linear' : 'width 300ms ease',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
