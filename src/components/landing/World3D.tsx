import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Boxes, Orbit, Sparkles, Layers } from 'lucide-react';

const WorldCanvas = lazy(() =>
  import('@/components/three/WorldCanvas').then((m) => ({ default: m.WorldCanvas }))
);

const FEATURES = [
  {
    icon: Boxes,
    title: 'Holographic Geometry',
    description: 'Floating cubes with wireframe overlays and transmission materials react to time and position.',
  },
  {
    icon: Orbit,
    title: 'Orbital Mechanics',
    description: 'Multiple rings with satellite objects orbit at different speeds and tilt angles for layered depth.',
  },
  {
    icon: Sparkles,
    title: 'Luminous Portals',
    description: 'Animated ring portals pulse and rotate, creating focal points of light in 3D space.',
  },
  {
    icon: Layers,
    title: 'Parallax Depth',
    description: 'Camera responds to both mouse movement and scroll position, shifting the entire composition.',
  },
];

export function World3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const { reducedMotion, isMobile } = useMediaQuery();
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.9, 1, 1, 0.95]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setScrollProgress(v);
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[120vh] py-24 overflow-hidden"
      id="world-3d"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-glow/[0.03] blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-violet-glow tracking-wide uppercase">Interactive 3D World</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-gradient-soft">
            A living dimension of light
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Holographic geometry, orbital rings, and luminous portals — all
            rendered in real-time WebGL. Move your mouse to explore, scroll to
            shift the camera.
          </p>
        </ScrollReveal>
      </div>

      {/* 3D Canvas */}
      <motion.div
        style={{ opacity, scale }}
        className="relative w-full h-[60vh] sm:h-[70vh] my-8"
      >
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-2 border-violet-glow/20 animate-spin-slow" />
          </div>
        }>
          <WorldCanvas
            reducedMotion={reducedMotion}
            isMobile={isMobile}
            scrollProgress={scrollProgress}
          />
        </Suspense>
      </motion.div>

      {/* Feature cards */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className="glass p-5 h-full group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-glow/10 border border-violet-glow/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-violet-glow" />
                </div>
                <h3 className="font-display text-sm font-semibold text-white mb-1.5">
                  {f.title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
