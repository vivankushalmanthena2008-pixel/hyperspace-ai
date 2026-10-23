import { useState, useEffect } from 'react';

export function useMediaQuery() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileMQ = window.matchMedia('(max-width: 768px)');

    const updateMotion = () => setReducedMotion(motionMQ.matches);
    const updateMobile = () => setIsMobile(mobileMQ.matches);

    updateMotion();
    updateMobile();

    motionMQ.addEventListener('change', updateMotion);
    mobileMQ.addEventListener('change', updateMobile);

    return () => {
      motionMQ.removeEventListener('change', updateMotion);
      mobileMQ.removeEventListener('change', updateMobile);
    };
  }, []);

  return { reducedMotion, isMobile };
}
