import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ParticleField } from '@/components/ParticleField';

interface FinalCTAProps {
  onCtaClick: () => void;
}

export function FinalCTA({ onCtaClick }: FinalCTAProps) {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <ParticleField density={40} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-glow/[0.03] to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-glow to-violet-glow blur-2xl opacity-20 rounded-full" />
            <h2 className="relative font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-soft leading-tight">
              Your next creative direction
              <br />
              is one prompt away
            </h2>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="mt-6 text-lg text-white/50 max-w-xl mx-auto">
            Stop staring at a blank page. Describe what you are building, pick a
            style, and get a complete creative brief in seconds.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onCtaClick} className="btn-primary w-full sm:w-auto text-base px-8 py-4">
              Open the Workspace
              <ArrowRight className="w-5 h-5" />
            </button>
            <span className="text-xs text-white/30">
              No sign-up required · Demo mode active
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
