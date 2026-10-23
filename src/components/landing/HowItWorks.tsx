import { ScrollReveal } from '@/components/ScrollReveal';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { PenLine, Sliders, FileOutput, Repeat } from 'lucide-react';

const STEPS = [
  {
    icon: PenLine,
    step: '01',
    title: 'Describe Your Project',
    description:
      'Write a prompt that captures what you are building — a brand, a campaign, a product launch, or a rebrand. No special format needed. Natural language works.',
  },
  {
    icon: Sliders,
    step: '02',
    title: 'Choose a Visual Style',
    description:
      'Pick from eight curated visual styles — from minimalist to cyberpunk, luxury editorial to playful vibrant. Each style shapes the entire brief output.',
  },
  {
    icon: FileOutput,
    step: '03',
    title: 'Generate Your Brief',
    description:
      'Get a structured creative brief with a concept summary, visual direction, color palette with hex codes, typography recommendations, suggested assets, and a next-steps checklist.',
  },
  {
    icon: Repeat,
    step: '04',
    title: 'Iterate and Refine',
    description:
      'Edit your prompt, switch styles, and regenerate as many times as you want. Your session history keeps every result so you can compare directions side by side.',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-sm font-medium text-violet-glow tracking-wide uppercase">How It Works</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-gradient-soft">
            Four steps to a creative direction
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            No learning curve. No complex setup. Just describe what you are making
            and let HyperSpace AI handle the creative foundation.
          </p>
        </ScrollReveal>

        <div className="relative max-w-3xl mx-auto">
          {/* Progress line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5 hidden sm:block" />
          <motion.div
            className="absolute left-8 top-0 w-px bg-gradient-to-b from-cyan-glow via-indigo-glow to-violet-glow hidden sm:block origin-top"
            style={{ scaleY: lineScale, height: '100%' }}
          />

          <div className="space-y-12 sm:space-y-16">
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex items-start gap-6 sm:gap-8 relative">
                  <div className="relative flex-shrink-0 hidden sm:block">
                    <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center relative z-10">
                      <step.icon className="w-7 h-7 text-cyan-glow" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-cyan-glow/10 blur-xl" />
                  </div>

                  <div className="flex-1 pl-2 sm:pl-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-white/30">{step.step}</span>
                      <div className="sm:hidden w-10 h-10 rounded-xl glass flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-cyan-glow" />
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
