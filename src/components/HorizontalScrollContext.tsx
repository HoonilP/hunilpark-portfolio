'use client';

import { createContext, useContext, useCallback, useRef } from 'react';

type ScrollToHandler = (sectionId: string) => boolean;

interface HorizontalScrollContextValue {
  registerScrollTo: (handler: ScrollToHandler) => void;
  scrollToSection: (sectionId: string) => boolean;
}

const HorizontalScrollContext = createContext<HorizontalScrollContextValue>({
  registerScrollTo: () => {},
  scrollToSection: () => false,
});

export function HorizontalScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const handlerRef = useRef<ScrollToHandler | null>(null);

  const registerScrollTo = useCallback((handler: ScrollToHandler) => {
    handlerRef.current = handler;
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    if (handlerRef.current) {
      return handlerRef.current(sectionId);
    }
    return false;
  }, []);

  return (
    <HorizontalScrollContext.Provider
      value={{ registerScrollTo, scrollToSection }}
    >
      {children}
    </HorizontalScrollContext.Provider>
  );
}

export function useHorizontalScroll() {
  return useContext(HorizontalScrollContext);
}
