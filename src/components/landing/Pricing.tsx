import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { CinematicButton } from '@/components/ui/CinematicButton';
import { audioService } from '@/services/audioService';
import type { ModalType } from '@/components/ui/InfoModal';

interface PricingProps {
  onCtaClick: () => void;
  onOpenModal: (type: ModalType) => void;
  isProActive?: boolean;
}

export function Pricing({ onCtaClick, onOpenModal, isProActive }: PricingProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'starter',
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
      action: () => {
        audioService.playNavSound();
        onCtaClick();
      },
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billing === 'annual' ? '₹1,199' : '₹1,499',
      period: '/mo',
      billingNote: billing === 'annual' ? 'billed annually (save 20%)' : 'billed monthly',
      description: 'For freelancers and creators who build every day.',
      features: [
        'Unlimited brief generations',
        'Interactive task checklists',
        'Export brief as Markdown & text',
        'Session persistence across briefs',
        'Priority generation algorithms',
        'Multi-style comparison',
      ],
      cta: isProActive ? 'Pro Active · Open Workspace' : 'Start Pro Trial',
      highlight: true,
      action: () => {
        audioService.playSelectSound();
        if (isProActive) {
          onCtaClick();
        } else {
          onOpenModal('proTrial');
        }
      },
    },
    {
      id: 'studio',
      name: 'Studio',
      price: billing === 'annual' ? '₹3,999' : '₹4,999',
      period: '/mo',
      billingNote: billing === 'annual' ? 'billed annually (save 20%)' : 'billed monthly',
      description: 'For creative studios, agencies, and design teams.',
      features: [
        'Everything in Pro',
        'Up to 10 team seats',
        'Custom brand presets',
        'Pipeline API integration',
        'Dedicated onboarding & support',
        'Commercial agency licensing',
      ],
      cta: 'Contact Sales',
      highlight: false,
      action: () => {
        audioService.playSelectSound();
        onOpenModal('contact');
      },
    },
  ];

  const handleBillingToggle = (mode: 'monthly' | 'annual') => {
    audioService.playToggleSound();
    setBilling(mode);
  };

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
          <div className="inline-flex items-center gap-1 p-1 rounded-xl glass border border-white/10">
            <button
              onClick={() => handleBillingToggle('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billing === 'monthly'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingToggle('annual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billing === 'annual'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Annual
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-glow/20 text-cyan-glow font-semibold">
                Save 20%
              </span>
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`relative p-6 sm:p-8 rounded-2xl h-full flex flex-col ${
                  plan.highlight
                    ? 'glass-strong border-cyan-glow/30 shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)]'
                    : 'glass'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-glow via-teal-300 to-indigo-glow text-xs font-semibold text-base-950 shadow-md">
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
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-white/40">{plan.period}</span>
                    )}
                  </div>
                  {plan.billingNote && (
                    <p className="text-[11px] text-cyan-glow/80 mt-1 font-mono">
                      {plan.billingNote}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-white/60">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.highlight ? 'text-cyan-glow' : 'text-white/30'
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <CinematicButton
                  variant={plan.highlight ? 'primary' : 'ghost'}
                  onClick={plan.action}
                  className="w-full"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </CinematicButton>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <p className="text-center text-xs text-white/30 mt-8">
            Demo workspace is free and unrestricted. Pro and Studio tiers represent commercial plans and features.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
