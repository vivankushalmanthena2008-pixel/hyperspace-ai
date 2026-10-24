import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ChevronDown } from 'lucide-react';
import { audioService } from '@/services/audioService';

const FAQ_ITEMS = [
  {
    question: 'What exactly does HyperSpace AI generate?',
    answer:
      'HyperSpace AI produces a structured creative brief from your text prompt and chosen visual style. Each brief includes a project title, a concept summary, a detailed visual direction, a color palette with hex codes and usage notes, typography recommendations, a list of suggested assets, mood keywords, and an interactive checklist of actionable next steps. It is a creative foundation — not finished design assets.',
  },
  {
    question: 'Is this connected to a live AI model?',
    answer:
      'The current demo runs in structured simulation mode, meaning results are generated from comprehensive creative algorithms that vary based on your prompt and style choice. The service layer is designed so a real AI provider can be connected through a secure server-side endpoint without exposing client credentials.',
  },
  {
    question: 'Do I need to sign up to use it?',
    answer:
      'No. You can open the workspace and generate briefs immediately without creating an account. Your results are saved in session memory for comparison and download. Pro and Studio tiers represent commercial team capabilities.',
  },
  {
    question: 'Can I edit my prompt and generate again?',
    answer:
      'Yes. After generating a brief, you can modify your prompt, switch to a different visual style, and regenerate as many times as you like. Each result is added to your session history, so you can compare different directions side by side.',
  },
  {
    question: 'What are the visual styles available?',
    answer:
      'There are eight curated styles: Minimalist, Bold Typographic, Organic & Natural, Futuristic / Cyberpunk, Retro / Vintage, Luxury Editorial, Playful & Vibrant, and Dark & Moody. Each one shapes the entire output — color palette, typography, visual direction, suggested assets, and mood keywords all adapt to your selection.',
  },
  {
    question: 'Can I use the generated briefs for commercial work?',
    answer:
      'Yes. The creative briefs are directional specifications — color palettes, typography suggestions, and strategic guidance. You retain full ownership and are free to use them as a starting point for any commercial client project.',
  },
  {
    question: 'How is my data handled?',
    answer:
      'In client demo mode, your prompts and generated briefs are stored strictly in your browser session. No data is sent to external advertising trackers. When connected to server-side AI, prompts are processed ephemerally.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (i: number) => {
    audioService.playToggleSound();
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-medium text-indigo-glow tracking-wide uppercase">FAQ</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-gradient-soft">
            Questions, answered
          </h2>
        </ScrollReveal>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div
                className={`glass rounded-2xl overflow-hidden transition-all border ${
                  openIndex === i ? 'border-cyan-glow/30 shadow-[0_0_20px_-5px_rgba(34,211,238,0.15)]' : 'border-white/[0.06]'
                }`}
              >
                <button
                  onClick={() => handleToggle(i)}
                  className="w-full flex items-center justify-between p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow rounded-2xl"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-medium text-white pr-4 text-sm sm:text-base">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      className={`w-5 h-5 ${openIndex === i ? 'text-cyan-glow' : 'text-white/30'}`}
                    />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-white/50 leading-relaxed border-t border-white/[0.04] pt-3">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
