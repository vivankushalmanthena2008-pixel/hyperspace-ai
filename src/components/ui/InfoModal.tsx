import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Mail, Send, Sparkles, Shield, FileText, Info } from 'lucide-react';
import { CinematicButton } from './CinematicButton';

export type ModalType = 'about' | 'privacy' | 'terms' | 'contact' | 'proTrial' | null;

interface InfoModalProps {
  type: ModalType;
  onClose: () => void;
  onActivatePro?: () => void;
  isProActive?: boolean;
}

export function InfoModal({ type, onClose, onActivatePro, isProActive }: InfoModalProps) {
  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [tier, setTier] = useState('Studio / Enterprise');
  const [isSent, setIsSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError('Please fill out all fields.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    setFormError(null);
    setIsSent(true);
  };

  const titles: Record<Exclude<ModalType, null>, { title: string; icon: React.ComponentType<{ className?: string }> }> = {
    about: { title: 'About HyperSpace AI', icon: Info },
    privacy: { title: 'Privacy Policy', icon: Shield },
    terms: { title: 'Terms of Service', icon: FileText },
    contact: { title: 'Contact & Sales Inquiry', icon: Mail },
    proTrial: { title: 'HyperSpace Pro Experience', icon: Sparkles },
  };

  const { title, icon: TitleIcon } = titles[type];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-base-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl bg-base-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[85vh]"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-base-950/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-glow/15 border border-cyan-glow/30 flex items-center justify-center">
                <TitleIcon className="w-4 h-4 text-cyan-glow" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 overflow-y-auto space-y-4 text-sm text-white/70 leading-relaxed">
            {type === 'about' && (
              <>
                <p>
                  <strong>HyperSpace AI</strong> is a creative intelligence engine designed for founders, art directors, designers, and marketers who need to turn abstract ideas into production-ready creative directions in seconds.
                </p>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-cyan-glow">
                    Our Core Philosophy
                  </h4>
                  <p className="text-xs text-white/60">
                    A brief shouldn't just be an unstructured paragraph of text. A true creative brief establishes concrete visual grammar: layout strategy, harmonic color palettes with exact contrast ratios, typography pairings, and a prioritized sequence of actionable milestones.
                  </p>
                </div>
                <p>
                  Built with React 18, TypeScript, Tailwind CSS, Framer Motion, and hardware-accelerated Three.js WebGL graphics with a zero-external-dependency procedural audio engine.
                </p>
              </>
            )}

            {type === 'privacy' && (
              <>
                <p className="text-white/80 font-medium">Last updated: October 2026</p>
                <p>
                  At HyperSpace AI, we respect your privacy. Here is how your data is handled:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-white/60">
                  <li><strong>Ephemeral Session Data:</strong> In client mode, prompts and generated briefs are stored strictly in your browser's session memory. Closing the tab resets session history unless explicitly exported.</li>
                  <li><strong>Zero Tracking Cookies:</strong> We do not deploy third-party advertising trackers or sell personal telemetry to brokers.</li>
                  <li><strong>Audio & Interface Preferences:</strong> Volume and muted states are stored locally in your browser's <code className="text-cyan-glow">localStorage</code> for your convenience.</li>
                  <li><strong>Secure Server-Side AI:</strong> AI Assistant requests are routed server-side without exposing API keys or user identity.</li>
                </ul>
              </>
            )}

            {type === 'terms' && (
              <>
                <p className="text-white/80 font-medium">Terms of Service & Commercial Usage</p>
                <p>
                  By using HyperSpace AI, you agree to the following terms:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-white/60">
                  <li><strong>Commercial Ownership:</strong> You retain 100% full commercial rights to use, modify, distribute, and execute upon the creative concepts, color palettes, typography specifications, and next-step roadmaps generated for your projects.</li>
                  <li><strong>Asset Sourcing:</strong> Suggested assets (e.g. photography, 3D renders, icon packs) describe specifications to create or commission; HyperSpace AI does not distribute copyrighted third-party media.</li>
                  <li><strong>Fair Usage:</strong> Automated scraping or denial-of-service stress tests on demo endpoints are prohibited.</li>
                </ul>
              </>
            )}

            {type === 'proTrial' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-glow/10 to-indigo-glow/10 border border-cyan-glow/30">
                  <div className="flex items-center gap-2 text-cyan-glow font-semibold mb-1">
                    <Sparkles className="w-4 h-4" />
                    HyperSpace Pro Trial
                  </div>
                  <p className="text-xs text-white/70">
                    Experience all pro features instantly in your session: persistent history retention, markdown and PDF exports, priority creative algorithms, and extended visual style configurations.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Unlimited brief generations in session</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Instant Markdown brief download</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Interactive task checklists for production</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>All 8 curated visual styling engines</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <CinematicButton variant="ghost" size="sm" onClick={onClose}>
                    Close
                  </CinematicButton>
                  <CinematicButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (onActivatePro) onActivatePro();
                      onClose();
                    }}
                  >
                    {isProActive ? 'Pro Mode Active' : 'Activate Pro Mode for Session'}
                  </CinematicButton>
                </div>
              </div>
            )}

            {type === 'contact' && (
              <>
                {isSent ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-display text-lg font-semibold text-white">Message Received!</h4>
                    <p className="text-xs text-white/60 max-w-sm mx-auto">
                      Thank you for reaching out, {name}. Our creative solutions team has logged your inquiry for the {tier} plan and will follow up with you at <strong className="text-cyan-glow">{email}</strong>.
                    </p>
                    <div className="pt-4">
                      <CinematicButton variant="primary" size="sm" onClick={onClose}>
                        Done
                      </CinematicButton>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {formError && (
                      <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                        {formError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="input-field text-xs py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1">Work Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex@company.com"
                          className="input-field text-xs py-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Plan of Interest</label>
                      <select
                        value={tier}
                        onChange={(e) => setTier(e.target.value)}
                        className="input-field text-xs py-2 bg-base-800 text-white"
                      >
                        <option value="Studio Plan (₹4,999/mo)">Studio Plan (₹4,999/mo)</option>
                        <option value="Enterprise / Agency License">Enterprise / Agency License</option>
                        <option value="Custom Pipeline API Integration">Custom Pipeline API Integration</option>
                        <option value="General Question / Feedback">General Question / Feedback</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Project Details or Inquiry</label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your team size, expected creative brief volume, or specific requirements..."
                        className="input-field text-xs py-2 resize-none"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-3">
                      <CinematicButton type="button" variant="ghost" size="sm" onClick={onClose}>
                        Cancel
                      </CinematicButton>
                      <CinematicButton type="submit" variant="primary" size="sm">
                        <Send className="w-3.5 h-3.5" />
                        Send Inquiry
                      </CinematicButton>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Footer for non-form modals */}
          {type !== 'contact' && type !== 'proTrial' && (
            <div className="px-6 py-3 border-t border-white/[0.06] bg-base-950/40 flex justify-end">
              <CinematicButton variant="ghost" size="sm" onClick={onClose}>
                Close
              </CinematicButton>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
