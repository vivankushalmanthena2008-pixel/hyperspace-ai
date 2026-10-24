import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { CinematicButton } from '@/components/ui/CinematicButton';
import { audioService } from '@/services/audioService';

interface NavbarProps {
  onNavigate: (page: 'landing' | 'workspace') => void;
  currentPage: 'landing' | 'workspace';
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: '3D World', href: '#world-3d' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    audioService.playNavSound();
    setMobileOpen(false);
    if (currentPage !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-base-950/85 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => {
              audioService.playNavSound();
              onNavigate('landing');
            }}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow rounded-xl p-1"
            aria-label="HyperSpace AI home"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-glow via-teal-300 to-violet-glow flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-cyan-glow/20">
              <Sparkles className="w-5 h-5 text-base-950" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-glow to-violet-glow blur-md opacity-50 -z-10" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              HyperSpace<span className="text-cyan-glow"> AI</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="px-3.5 py-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <CinematicButton
              variant="ghost"
              size="sm"
              onClick={() => {
                audioService.playNavSound();
                onNavigate('workspace');
              }}
            >
              Workspace
            </CinematicButton>
            <CinematicButton
              variant="primary"
              size="sm"
              onClick={() => {
                audioService.playNavSound();
                onNavigate('workspace');
              }}
            >
              Try Free
              <ArrowRight className="w-3.5 h-3.5" />
            </CinematicButton>
          </div>

          <button
            className="md:hidden p-2 text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow rounded-lg"
            onClick={() => {
              audioService.playToggleSound();
              setMobileOpen(!mobileOpen);
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-base-950/95 backdrop-blur-xl border-b border-white/[0.08] md:hidden overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-4 flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <CinematicButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    audioService.playNavSound();
                    setMobileOpen(false);
                    onNavigate('workspace');
                  }}
                  className="w-full"
                >
                  Launch Workspace Free
                  <ArrowRight className="w-4 h-4" />
                </CinematicButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
