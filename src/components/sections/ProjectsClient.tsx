'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import VelocityCard from '@/components/interactive/VelocityCard';
import type { VelocityProject } from '@/components/interactive/VelocityCard';
import type { CarouselProject } from '@/components/interactive/ReelCarousel';

const ReelCarousel = dynamic(() => import('@/components/interactive/ReelCarousel'), { ssr: false });
const EyeFollowButton = dynamic(() => import('@/components/interactive/EyeFollowButton'), { ssr: false });

interface ProjectsClientProps {
  featured: CarouselProject[];
  others: VelocityProject[];
  viewDetailsLabel: string;
  moreProjectsLabel: string;
}

export default function ProjectsClient({
  featured,
  others,
  viewDetailsLabel,
  moreProjectsLabel,
}: ProjectsClientProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-16">
      {/* Featured Carousel */}
      <ReelCarousel projects={featured} viewDetailsLabel={viewDetailsLabel} />

      {/* More Projects Toggle */}
      {others.length > 0 && (
        <div className="flex flex-col items-center gap-10">
          <EyeFollowButton
            label={moreProjectsLabel}
            onClick={() => setShowMore(!showMore)}
            isOpen={showMore}
          />

          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {others.map((project, i) => (
                    <VelocityCard
                      key={project.id}
                      project={project}
                      viewDetailsLabel={viewDetailsLabel}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
