import { ScrollReveal } from '@/components/ScrollReveal';
import { motion } from 'framer-motion';
import { Zap, Palette, Target, Layers, Workflow, Globe } from 'lucide-react';

const BENEFITS = [
  {
    icon: Zap,
    title: 'From Prompt to Direction in Seconds',
    description:
      'Skip the blank-page paralysis. Describe your project, pick a style, and get a structured creative brief instantly.',
    accent: 'cyan',
  },
  {
    icon: Palette,
    title: 'Curated Color Palettes',
    description:
      'Every brief includes a hand-tuned color palette with hex codes, usage guidelines, and contrast-aware pairings.',
    accent: 'indigo',
  },
  {
    icon: Target,
    title: 'Actionable Next Steps',
    description:
      'No vague suggestions. Each brief ends with a concrete checklist of what to do next — from mood boards to prototyping.',
    accent: 'violet',
  },
  {
    icon: Layers,
    title: 'Visual Direction, Not Just Text',
    description:
      'Get a written visual strategy that covers layout philosophy, lighting, texture, and compositional approach.',
    accent: 'cyan',
  },
  {
    icon: Workflow,
    title: 'Eight Distinct Visual Styles',
    description:
      'From minimalist to cyberpunk, luxury editorial to playful vibrant — choose the aesthetic that fits your project.',
    accent: 'indigo',
  },
  {
    icon: Globe,
    title: 'Built for Real Workflows',
    description:
      'Copy results, edit your prompt and regenerate, or review your session history. Designed for iteration, not one-shots.',
    accent: 'violet',
  },
];

const ACCENT_MAP: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  cyan: { text: 'text-cyan-glow', bg: 'bg-cyan-glow/10', border: 'border-cyan-glow/20', glow: 'glow-cyan' },
  indigo: { text: 'text-indigo-glow', bg: 'bg-indigo-glow/10', border: 'border-indigo-glow/20', glow: 'glow-indigo' },
  violet: { text: 'text-violet-glow', bg: 'bg-violet-glow/10', border: 'border-violet-glow/20', glow: 'glow-violet' },
};

export function Benefits() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-cyan-glow tracking-wide uppercase">Benefits</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-gradient-soft">
            Everything you need to start building
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            HyperSpace AI gives you a complete creative foundation — not just
            inspiration, but a structured direction you can hand to a designer or act on yourself.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, i) => {
            const accent = ACCENT_MAP[benefit.accent];
            return (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="glass p-6 h-full hover:border-white/10 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl ${accent.bg} ${accent.border} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <benefit.icon className={`w-6 h-6 ${accent.text}`} />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2 text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
