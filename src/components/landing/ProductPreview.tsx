import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Palette, Type, Image, CheckCircle2, Sparkles } from 'lucide-react';
import { audioService } from '@/services/audioService';

const PREVIEW_STEPS = [
  {
    icon: Sparkles,
    label: 'Enter Prompt',
    content: 'A sustainable fashion brand launching a recycled denim collection',
  },
  {
    icon: Palette,
    label: 'Pick Style',
    content: 'Organic & Natural — earthy, flowing, warm',
  },
  {
    icon: Type,
    label: 'Get Brief',
    content: 'Rooted: A Sustainable Denim Collection',
  },
  {
    icon: Image,
    label: 'Color Palette',
    content: 'Forest Green, Warm Sand, Terracotta, Cream, Slate Brown',
  },
];

const PREVIEW_STYLES = [
  { name: 'Minimalist', mood: 'clean & architectural' },
  { name: 'Organic & Natural', mood: 'earthy, flowing & warm' },
  { name: 'Bold Typographic', mood: 'high-contrast & loud' },
  { name: 'Futuristic Cyberpunk', mood: 'neon glow & dark space' },
];

export function ProductPreview() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPreviewStyle, setSelectedPreviewStyle] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PREVIEW_STEPS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleStepClick = (i: number) => {
    setIsAutoPlaying(false);
    audioService.playSelectSound();
    setActiveStep(i);
  };

  const paletteColors = [
    { name: 'Forest Green', hex: '#2D5A3D' },
    { name: 'Warm Sand', hex: '#D4B896' },
    { name: 'Terracotta', hex: '#C66B3D' },
    { name: 'Cream', hex: '#F5F0E8' },
    { name: 'Slate Brown', hex: '#5C4A3A' },
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-indigo-glow/[0.05] blur-[80px]" />
      <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-cyan-glow/[0.05] blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-indigo-glow tracking-wide uppercase">Interactive Preview</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-gradient-soft">
            See it in action
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Watch how a single prompt becomes a complete creative brief.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Steps timeline */}
          <ScrollReveal>
            <div className="space-y-4">
              {PREVIEW_STEPS.map((step, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleStepClick(i)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all ${
                    activeStep === i
                      ? 'glass-strong border-cyan-glow/30 shadow-[0_0_25px_-5px_rgba(34,211,238,0.2)]'
                      : 'glass opacity-60 hover:opacity-90'
                  }`}
                  aria-pressed={activeStep === i}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      activeStep === i ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium mb-1 ${activeStep === i ? 'text-white' : 'text-white/60'}`}>
                      {step.label}
                    </div>
                    <AnimatePresence mode="wait">
                      {activeStep === i && (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-xs text-white/45"
                        >
                          {step.content}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  {activeStep === i && (
                    <CheckCircle2 className="w-5 h-5 text-cyan-glow flex-shrink-0 mt-1" />
                  )}
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Preview card */}
          <ScrollReveal delay={0.2}>
            <motion.div
              className="glass-strong p-6 sm:p-8 rounded-2xl border border-white/10"
              animate={{
                boxShadow:
                  activeStep === 2
                    ? '0 0 60px -15px rgba(34,211,238,0.25)'
                    : '0 0 0px rgba(0,0,0,0)',
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                </div>
                <span className="text-xs text-white/30 font-mono">brief-preview.tsx</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeStep === 0 && (
                    <div>
                      <label className="text-xs text-white/40 font-mono mb-2 block">PROMPT INPUT</label>
                      <div className="bg-base-800/60 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-white/80 leading-relaxed">
                          A sustainable fashion brand launching a recycled denim collection
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <div className="flex-1 h-10 rounded-lg bg-gradient-to-r from-cyan-glow/20 to-indigo-glow/20 border border-cyan-glow/30 flex items-center justify-center text-xs text-cyan-glow font-medium">
                          Processing Creative Direction...
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div>
                      <label className="text-xs text-white/40 font-mono mb-2 block">STYLE SELECTION (CLICK TO TEST)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {PREVIEW_STYLES.map((s, i) => (
                          <button
                            key={s.name}
                            onClick={() => {
                              setSelectedPreviewStyle(i);
                              audioService.playSelectSound();
                            }}
                            className={`p-3 rounded-lg border text-xs text-left transition-all ${
                              selectedPreviewStyle === i
                                ? 'bg-cyan-glow/15 border-cyan-glow/50 text-white shadow-sm'
                                : 'bg-white/[0.02] border-white/10 text-white/40 hover:text-white/70'
                            }`}
                          >
                            <div className="font-semibold">{s.name}</div>
                            <div className="text-[10px] text-white/40 mt-0.5">{s.mood}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div>
                      <label className="text-xs text-white/40 font-mono mb-2 block">CREATIVE BRIEF</label>
                      <h3 className="font-display text-xl font-bold text-gradient mb-3">
                        Rooted: A Sustainable Denim Collection
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed mb-4">
                        A creative system that blends strategic clarity with organic
                        warmth. The concept centers on communicating sustainability
                        through layered visual storytelling...
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['grounded', 'warm', 'flowing', 'alive', 'tactile'].map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-cyan-glow border border-cyan-glow/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div>
                      <label className="text-xs text-white/40 font-mono mb-2 block">COLOR PALETTE</label>
                      <div className="space-y-2">
                        {paletteColors.map((color) => (
                          <div
                            key={color.name}
                            className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex-shrink-0 border border-white/10 shadow-sm"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white/80">{color.name}</div>
                              <div className="text-xs text-white/30 font-mono">{color.hex}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
