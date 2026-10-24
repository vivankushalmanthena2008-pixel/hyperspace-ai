import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CinematicButton } from '@/components/ui/CinematicButton';
import { audioService } from '@/services/audioService';

const HeroCanvas = lazy(() =>
  import('@/components/three/HeroCanvas').then((m) => ({ default: m.HeroCanvas }))
);

interface HeroProps {
  onCtaClick: () => void;
}

export function Hero({ onCtaClick }: HeroProps) {
  const { reducedMotion, isMobile } = useMediaQuery();

  const handleCta = () => {
    audioService.playNavSound();
    onCtaClick();
  };

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    audioService.playNavSound();
    document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-base-950/40 via-transparent to-base-950" />

      {/* Glowing ambient orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-cyan-glow/[0.04] blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-violet-glow/[0.04] blur-[120px]" />

      {/* 3D Canvas — full background on mobile, right side on desktop */}
      <div className="absolute inset-0 z-0 lg:right-0 lg:w-1/2 lg:left-auto pointer-events-auto">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-2 border-cyan-glow/20 animate-spin-slow" />
            </div>
          }
        >
          <HeroCanvas reducedMotion={reducedMotion} isMobile={isMobile} />
        </Suspense>
      </div>

      {/* Gradient overlay for text readability on left side */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-base-950 via-base-950/60 to-transparent lg:from-base-950 lg:via-base-950/50 lg:to-base-950/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-20 w-full pointer-events-none">
        {/* Left: Copy */}
        <div className="text-center lg:text-left pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-white/70 mb-6 border border-white/10 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-glow" />
            Creative Brief Intelligence · 3D Real-Time World
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
          >
            <span className="text-gradient-soft">Turn a prompt into a</span>
            <br />
            <span className="text-gradient">creative direction</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            HyperSpace AI transforms a single text prompt into a structured
            creative brief — visual direction, color palette, typography,
            suggested assets, and actionable next steps. In seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <CinematicButton
              variant="primary"
              size="lg"
              onClick={handleCta}
              className="w-full sm:w-auto"
            >
              Generate Your First Brief
              <ArrowRight className="w-4 h-4" />
            </CinematicButton>
            <CinematicButton
              variant="ghost"
              size="lg"
              onClick={handleExplore}
              className="w-full sm:w-auto"
            >
              <Layers className="w-4 h-4 text-cyan-glow" />
              Explore Features
            </CinematicButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-xs text-white/40"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Instant simulation mode · No sign-up required
            </span>
          </motion.div>
        </div>

        {/* Right: spacer for 3D canvas on desktop */}
        <div className="hidden lg:block pointer-events-none" />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/15 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-glow"
          />
        </div>
      </motion.div>
    </section>
  );
}
