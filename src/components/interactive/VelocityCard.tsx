'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export interface VelocityProject {
  id: string;
  title: string;
  description: string;
  period: string;
  techStack: string[];
  image: string;
}

interface VelocityCardProps {
  project: VelocityProject;
  viewDetailsLabel: string;
  index?: number;
}

export default function VelocityCard({ project, viewDetailsLabel, index = 0 }: VelocityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/projects/${project.id}`}
        className="group block"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
          {/* Image */}
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={60}
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Default dark overlay */}
          <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-0" />

          {/* Glassmorphic overlay — slides up on hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
            <div className="bg-black/60 p-5 backdrop-blur-[10px] md:p-6">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-bold text-white">{project.title}</h3>
              <p className="mt-1 text-sm text-slate-300 leading-relaxed line-clamp-2">
                {project.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
                {viewDetailsLabel}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Below-image info (visible by default) */}
        <div className="mt-4 flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.title}</h3>
            <p className="text-sm text-slate-500">{project.techStack.slice(0, 3).join(' · ')}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-semibold text-blue-500 transition-colors group-hover:bg-blue-500/10 dark:border-blue-400/20 dark:text-blue-400">
            {viewDetailsLabel}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
