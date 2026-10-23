import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'landing' | 'workspace') => void;
}

export function Footer({ onNavigate }: FooterProps) {
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
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-cyan-glow hover:border-cyan-glow/30 transition-all"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => onNavigate('workspace')} className="text-white/40 hover:text-white transition-colors">
                  Workspace
                </button>
              </li>
              <li><a href="#features" onClick={(e) => e.preventDefault()} className="text-white/40 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" onClick={(e) => e.preventDefault()} className="text-white/40 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#faq" onClick={(e) => e.preventDefault()} className="text-white/40 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="text-white/40 hover:text-white transition-colors">About</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="text-white/40 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="text-white/40 hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="text-white/40 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} HyperSpace AI. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Built with React, TypeScript, Tailwind CSS & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
