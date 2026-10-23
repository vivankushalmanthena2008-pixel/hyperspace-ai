import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Check, Sparkles } from 'lucide-react';

interface PricingProps {
  onCtaClick: () => void;
}

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'For exploring creative directions and one-off projects.',
    features: [
      '10 brief generations per month',
      'All 8 visual styles',
      'Color palette with hex codes',
      'Copy results to clipboard',
      'Session history (current session)',
    ],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹1,499',
    period: '/mo',
    description: 'For freelancers and small teams who create every day.',
    features: [
      'Unlimited brief generations',
      'Saved brief history (persistent)',
      'Export brief as PDF',
      'Custom brand voice input',
      'Priority generation speed',
      'Team sharing links',
    ],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Studio',
    price: '₹4,999',
    period: '/mo',
    description: 'For agencies managing multiple creative projects.',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared workspace & brief library',
      'Custom style presets',
      'API access for pipeline integration',
      'Priority support',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export function Pricing({ onCtaClick }: PricingProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-glow/[0.04] blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-cyan-glow tracking-wide uppercase">Pricing</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-gradient-soft">
            Plans that scale with your creative output
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </ScrollReveal>

        {/* Billing toggle */}
        <ScrollReveal delay={0.1} className="flex items-center justify-center mb-12">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl glass">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billing === 'monthly' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billing === 'annual' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              Annual
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-glow/15 text-cyan-glow">Save 20%</span>
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`relative p-6 sm:p-8 rounded-2xl h-full flex flex-col ${
                  plan.highlight
                    ? 'glass-strong border-cyan-glow/20 glow-cyan'
                    : 'glass'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-glow to-indigo-glow text-xs font-semibold text-base-950">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <h3 className="font-display text-lg font-semibold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-white/40 mb-6 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="font-display text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-white/40">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-white/60">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-cyan-glow' : 'text-white/30'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onCtaClick}
                  className={`w-full ${plan.highlight ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <p className="text-center text-xs text-white/30 mt-8">
            All prices are illustrative for demo purposes. No payment is processed.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
