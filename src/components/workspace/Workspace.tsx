import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Circle,
  Type,
  Leaf,
  Cpu,
  Clock,
  Crown,
  Palette,
  Moon,
  X,
  Lightbulb,
} from 'lucide-react';
import { STYLE_OPTIONS, type CreativeBrief, type VisualStyle } from '@/types';
import { generationService } from '@/services/generationService';
import { BriefResult } from '@/components/workspace/BriefResult';
import { HistoryPanel } from '@/components/workspace/HistoryPanel';
import { CinematicButton } from '@/components/ui/CinematicButton';
import { audioService } from '@/services/audioService';

interface WorkspaceProps {
  onBack: () => void;
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
  isProActive?: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Circle,
  Type,
  Leaf,
  Cpu,
  Clock,
  Crown,
  Palette,
  Moon,
};

const PROMPT_SUGGESTIONS = [
  {
    title: 'Recycled Denim Fashion',
    text: 'A circular sustainable streetwear brand launching a recycled denim collection for eco-conscious urban creators.',
    style: 'organic-natural' as VisualStyle,
  },
  {
    title: 'Cyberpunk Rogue-Lite Game',
    text: 'A fast-paced synthwave cyber-heist rogue-lite set in high-altitude Neo-Tokyo megastructures with holographic HUDs.',
    style: 'futuristic-cyberpunk' as VisualStyle,
  },
  {
    title: 'Nordic Architectural Studio',
    text: 'A minimalist Scandinavian architecture firm creating zero-emissions timber cabins that blend into boreal forests.',
    style: 'minimalist' as VisualStyle,
  },
  {
    title: 'Swiss Horology Atelier',
    text: 'A luxury bespoke mechanical watch atelier handcrafting celestial tourbillon timepieces for discerning collectors.',
    style: 'luxury-editorial' as VisualStyle,
  },
];

const MIN_PROMPT_LENGTH = 10;
const MAX_PROMPT_LENGTH = 500;

export function Workspace({ onBack, onShowToast, isProActive }: WorkspaceProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<VisualStyle>('minimalist');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBrief, setCurrentBrief] = useState<CreativeBrief | null>(null);
  const [history, setHistory] = useState<CreativeBrief[]>([]);

  const promptLength = prompt.trim().length;
  const isValid = promptLength >= MIN_PROMPT_LENGTH && promptLength <= MAX_PROMPT_LENGTH;

  const handleGenerate = async () => {
    setError(null);

    if (!isValid) {
      audioService.playToggleSound();
      setError(
        promptLength < MIN_PROMPT_LENGTH
          ? `Please enter at least ${MIN_PROMPT_LENGTH} characters describing your project.`
          : `Please keep your prompt under ${MAX_PROMPT_LENGTH} characters.`
      );
      return;
    }

    audioService.playGenerateSound();
    setIsGenerating(true);

    try {
      const brief = await generationService.generate({
        prompt: prompt.trim(),
        style: selectedStyle,
      });
      setCurrentBrief(brief);
      setHistory((prev) => [brief, ...prev]);
      if (onShowToast) {
        onShowToast(`Creative brief generated for "${brief.title}"!`, 'success');
      }
    } catch {
      setError('Something went wrong while generating your brief. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectStarter = (starter: (typeof PROMPT_SUGGESTIONS)[0]) => {
    audioService.playSelectSound();
    setPrompt(starter.text);
    setSelectedStyle(starter.style);
    setError(null);
  };

  const handleClearHistory = () => {
    audioService.playToggleSound();
    setHistory([]);
    if (onShowToast) {
      onShowToast('Session history cleared', 'info');
    }
  };

  const handleSelectHistory = (brief: CreativeBrief) => {
    audioService.playSelectSound();
    setCurrentBrief(brief);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-base-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              audioService.playNavSound();
              onBack();
            }}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow rounded-lg px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
            {isProActive && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40 font-semibold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3" />
                Pro Tier Active
              </span>
            )}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-glow to-violet-glow flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-base-950" />
              </div>
              <span className="font-display text-sm font-semibold">
                HyperSpace<span className="text-cyan-glow"> AI</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main column */}
          <div className="space-y-6">
            {/* Input panel */}
            <div className="glass-strong p-6 sm:p-8 rounded-2xl border border-white/10">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h2 className="font-display text-2xl font-bold text-gradient-soft">
                    Creative Brief Engine
                  </h2>
                  <p className="text-sm text-white/40">
                    Describe what you are building, select a curated aesthetic, and generate a multi-part direction.
                  </p>
                </div>
              </div>

              {/* Quick starter chips */}
              <div className="mt-4 mb-5">
                <div className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick Start Prompts:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PROMPT_SUGGESTIONS.map((starter) => (
                    <button
                      key={starter.title}
                      onClick={() => handleSelectStarter(starter)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white/70 hover:text-white hover:border-cyan-glow/40 hover:bg-white/[0.06] transition-all"
                    >
                      {starter.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt input */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="prompt-input" className="block text-sm font-medium text-white/80">
                    Project Description
                  </label>
                  {prompt && (
                    <button
                      onClick={() => {
                        audioService.playToggleSound();
                        setPrompt('');
                      }}
                      className="text-xs text-white/30 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  rows={4}
                  maxLength={MAX_PROMPT_LENGTH}
                  placeholder="e.g. A sustainable fashion brand launching a recycled denim collection targeting eco-conscious urban creators..."
                  className="input-field resize-none text-sm leading-relaxed"
                  aria-describedby="prompt-help"
                />
                <div id="prompt-help" className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/40">
                    {promptLength < MIN_PROMPT_LENGTH
                      ? `${MIN_PROMPT_LENGTH - promptLength} more characters required`
                      : 'Press Cmd/Ctrl + Enter to generate'}
                  </span>
                  <span
                    className={`text-xs font-mono ${
                      promptLength > MAX_PROMPT_LENGTH * 0.9 ? 'text-amber-400' : 'text-white/30'
                    }`}
                  >
                    {prompt.length}/{MAX_PROMPT_LENGTH}
                  </span>
                </div>
              </div>

              {/* Style selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Visual Style Philosophy
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {STYLE_OPTIONS.map((style) => {
                    const Icon = ICON_MAP[style.icon] || Circle;
                    const isSelected = selectedStyle === style.value;
                    return (
                      <button
                        key={style.value}
                        onClick={() => {
                          audioService.playSelectSound();
                          setSelectedStyle(style.value);
                        }}
                        className={`p-3 rounded-xl text-left transition-all group ${
                          isSelected
                            ? 'bg-cyan-glow/[0.12] border border-cyan-glow/50 shadow-[0_0_20px_-3px_rgba(34,211,238,0.3)]'
                            : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <Icon
                          className={`w-5 h-5 mb-2 transition-colors ${
                            isSelected ? 'text-cyan-glow' : 'text-white/40 group-hover:text-white/70'
                          }`}
                        />
                        <div
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-white' : 'text-white/70'
                          }`}
                        >
                          {style.label}
                        </div>
                        <div className="text-[11px] text-white/30 mt-0.5 hidden sm:block leading-tight">
                          {style.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/[0.08] border border-red-500/25 mb-4"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300/90">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generate button */}
              <CinematicButton
                variant="primary"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || !isValid}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Synthesizing Creative Brief...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Creative Brief
                  </>
                )}
              </CinematicButton>

              {/* Simulation Mode Notice */}
              <p className="text-xs text-white/30 text-center mt-3">
                Structured simulation mode active · Instant generation without API bottlenecks
              </p>
            </div>

            {/* Results area */}
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass p-12 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center"
                >
                  <div className="relative w-20 h-20 mb-6">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-cyan-glow/20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-glow"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-cyan-glow animate-pulse" />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-1">
                    Synthesizing creative foundation...
                  </h3>
                  <p className="text-sm text-white/40 max-w-sm">
                    Harmonizing color palette, typography scales, visual direction, and sequential assets.
                  </p>
                </motion.div>
              ) : currentBrief ? (
                <motion.div
                  key={currentBrief.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BriefResult brief={currentBrief} onShowToast={onShowToast} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass p-12 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
                    <Wand2 className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white/70 mb-2">
                    No brief generated yet
                  </h3>
                  <p className="text-sm text-white/35 max-w-sm">
                    Enter your project summary above or pick a quick-start prompt, select your preferred aesthetic, and generate your brief.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History sidebar */}
          <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
            <HistoryPanel
              briefs={history}
              onSelect={handleSelectHistory}
              onClear={handleClearHistory}
              activeId={currentBrief?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
