import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'What exactly does HyperSpace AI generate?',
    answer:
      'HyperSpace AI produces a structured creative brief from your text prompt and chosen visual style. Each brief includes a project title, a concept summary, a detailed visual direction, a color palette with hex codes and usage notes, typography recommendations, a list of suggested assets, mood keywords, and a checklist of actionable next steps. It is a creative foundation — not finished design assets.',
  },
  {
    question: 'Is this connected to a live AI model?',
    answer:
      'The current demo runs in simulation mode, meaning results are generated from structured templates that vary based on your prompt and style choice. This is clearly disclosed in the workspace. The service layer is designed so a real AI provider can be connected through a secure server-side endpoint without changing the frontend. No API keys are ever exposed in the browser.',
  },
  {
    question: 'Do I need to sign up to use it?',
    answer:
      'No. You can open the workspace and generate briefs immediately without creating an account. Your results are saved for the duration of your browser session. The pricing plans describe what a future full version would offer, including persistent saved history and team features.',
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
      'Yes. The creative briefs are directional documents — color palettes, typography suggestions, and strategic guidance. You are free to use them as a starting point for any project. The briefs themselves do not include licensed assets; the suggested assets list describes what you should source or commission.',
  },
  {
    question: 'How is my data handled?',
    answer:
      'In the current demo mode, your prompts and generated briefs are stored in your browser session. No data is sent to external servers during demo generation. When a real AI backend is connected, prompts would be sent to a secure server-side endpoint — never directly to a third-party API from the browser.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
                className={`glass overflow-hidden transition-all ${
                  openIndex === i ? 'border-cyan-glow/20' : ''
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-medium text-white pr-4">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 ${openIndex === i ? 'text-cyan-glow' : 'text-white/30'}`} />
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
                      <p className="px-5 pb-5 text-sm text-white/50 leading-relaxed">
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
