'use client';

import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useHorizontalScroll } from './HorizontalScrollContext';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const HORIZONTAL_SECTIONS = ['hero', 'about', 'skills'];

export default function HorizontalScrollWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [enabled, setEnabled] = useState(false);
  const { registerScrollTo } = useHorizontalScroll();

  // Check desktop + no reduced-motion
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches;

    const update = () => setEnabled(mql.matches && motionOk);
    update();

    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!enabled || !containerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const panels = track.children;
      const panelCount = panels.length;
      if (panelCount <= 1) return;

      const scrollDistance = track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => `+=${scrollDistance}`,
        },
      });

      triggerRef.current = tween.scrollTrigger ?? null;

      // Register scroll-to handler for Header nav
      registerScrollTo((sectionId: string) => {
        const st = triggerRef.current;
        if (!st) return false;

        const idx = HORIZONTAL_SECTIONS.indexOf(sectionId);
        if (idx === -1) return false;

        // Calculate the scroll position for this panel
        const progress = idx / (panelCount - 1);
        const scrollTo = st.start + progress * (st.end - st.start);

        gsap.to(window, {
          scrollTo: { y: scrollTo },
          duration: 1,
          ease: 'power2.inOut',
        });

        return true;
      });

      return () => {
        triggerRef.current = null;
      };
    },
    { scope: containerRef, dependencies: [enabled] }
  );

  // Mobile / reduced-motion: pass-through
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div ref={trackRef} className="flex w-max">
        {children}
      </div>
    </div>
  );
}
