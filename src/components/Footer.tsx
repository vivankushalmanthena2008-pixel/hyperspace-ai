import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react';
import type { ModalType } from '@/components/ui/InfoModal';
import { audioService } from '@/services/audioService';

interface FooterProps {
  onNavigate: (page: 'landing' | 'workspace') => void;
  onOpenModal: (type: ModalType) => void;
}

export function Footer({ onNavigate, onOpenModal }: FooterProps) {
  const handleNavClick = (sectionId: string) => {
    audioService.playNavSound();
    onNavigate('landing');
    setTimeout(() => {
      document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  return (
    <footer className="relative border-t border-white/[0.06] bg-base-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-glow to-violet-glow flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-base-950" />
              </div>
              <span className="font-display text-lg font-semibold">
                HyperSpace<span className="text-cyan-glow"> AI</span>
              </span>
            </div>
            <p className="text-sm text-white/40 max-w-md leading-relaxed">
              Creative brief intelligence for designers, agencies, and founders.
              Turn a single prompt into a structured creative direction — visual
              language, color, typography, and actionable next steps.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://twitter.com/intent/tweet?text=Checking%20out%20HyperSpace%20AI%20%E2%80%94%20Generate%20structured%20creative%20briefs%20from%20a%20single%20prompt!"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioService.playNavSound()}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-cyan-glow hover:border-cyan-glow/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/vivankushalmanthena2008-pixel/hyperspace-ai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioService.playNavSound()}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-cyan-glow hover:border-cyan-glow/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow"
                aria-label="View source on GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/vivankushalmanthena2008-pixel/hyperspace-ai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioService.playNavSound()}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-cyan-glow hover:border-cyan-glow/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => {
                    audioService.playNavSound();
                    onNavigate('workspace');
                  }}
                  className="text-white/40 hover:text-cyan-glow transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#features')}
                  className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#pricing')}
                  className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#faq')}
                  className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => {
                    audioService.playNavSound();
                    onOpenModal('about');
                  }}
                  className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    audioService.playNavSound();
                    onOpenModal('privacy');
                  }}
                  className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    audioService.playNavSound();
                    onOpenModal('terms');
                  }}
                  className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    audioService.playNavSound();
                    onOpenModal('contact');
                  }}
                  className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  Contact & Sales
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} HyperSpace AI. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Built with React, TypeScript, Three.js WebGL & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
