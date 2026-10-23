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
} from 'lucide-react';
import { STYLE_OPTIONS, type CreativeBrief, type VisualStyle } from '@/types';
import { generationService } from '@/services/generationService';
import { BriefResult } from '@/components/workspace/BriefResult';
import { HistoryPanel } from '@/components/workspace/HistoryPanel';

interface WorkspaceProps {
  onBack: () => void;
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

const MIN_PROMPT_LENGTH = 10;
const MAX_PROMPT_LENGTH = 500;

export function Workspace({ onBack }: WorkspaceProps) {
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
      setError(
        promptLength < MIN_PROMPT_LENGTH
          ? `Please enter at least ${MIN_PROMPT_LENGTH} characters describing your project.`
          : `Please keep your prompt under ${MAX_PROMPT_LENGTH} characters.`
      );
      return;
    }

    setIsGenerating(true);
    try {
      const brief = await generationService.generate({
        prompt: prompt.trim(),
        style: selectedStyle,
      });
      setCurrentBrief(brief);
      setHistory((prev) => [brief, ...prev]);
    } catch {
      setError('Something went wrong while generating your brief. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSelectHistory = (brief: CreativeBrief) => {
    setCurrentBrief(brief);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-base-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-glow to-violet-glow flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-base-950" />
            </div>
            <span className="font-display text-sm font-semibold">
              HyperSpace<span className="text-cyan-glow"> AI</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main column */}
          <div className="space-y-6">
            {/* Input panel */}
            <div className="glass-strong p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-gradient-soft mb-1">
                Creative Workspace
              </h2>
              <p className="text-sm text-white/40 mb-6">
                Describe your project, choose a visual style, and generate a structured creative brief.
              </p>

              {/* Prompt input */}
              <div className="mb-6">
                <label htmlFor="prompt-input" className="block text-sm font-medium text-white/70 mb-2">
                  Project Description
                </label>
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
                  placeholder="e.g. A sustainable fashion brand launching a recycled denim collection targeting eco-conscious millennials..."
                  className="input-field resize-none text-sm leading-relaxed"
                  aria-describedby="prompt-help"
                />
                <div id="prompt-help" className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/30">
                    {promptLength < MIN_PROMPT_LENGTH
                      ? `${MIN_PROMPT_LENGTH - promptLength} more characters needed`
                      : 'Press Cmd/Ctrl + Enter to generate'}
                  </span>
                  <span className={`text-xs font-mono ${promptLength > MAX_PROMPT_LENGTH * 0.9 ? 'text-amber-400' : 'text-white/20'}`}>
                    {prompt.length}/{MAX_PROMPT_LENGTH}
                  </span>
                </div>
              </div>

              {/* Style selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/70 mb-3">
                  Visual Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STYLE_OPTIONS.map((style) => {
                    const Icon = ICON_MAP[style.icon] || Circle;
                    const isSelected = selectedStyle === style.value;
                    return (
                      <button
                        key={style.value}
                        onClick={() => setSelectedStyle(style.value)}
                        className={`p-3 rounded-xl text-left transition-all group ${
                          isSelected
                            ? 'bg-cyan-glow/[0.08] border border-cyan-glow/30'
                            : 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-cyan-glow' : 'text-white/40 group-hover:text-white/60'}`} />
                        <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-white/60'}`}>
                          {style.label}
                        </div>
                        <div className="text-xs text-white/25 mt-0.5 hidden sm:block">
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
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 mb-4"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300/80">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !isValid}
                className="btn-primary w-full text-base py-3.5"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Brief...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Creative Brief
                  </>
                )}
              </button>

              {/* Demo mode notice */}
              {generationService.isDemoMode() && (
                <p className="text-xs text-white/25 text-center mt-3">
                  Demo mode active — results are simulated, not from a live AI model
                </p>
              )}
            </div>

            {/* Results area */}
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass p-12 flex flex-col items-center justify-center"
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
                    Crafting your brief...
                  </h3>
                  <p className="text-sm text-white/40">
                    Analyzing your prompt and applying visual direction
                  </p>
                </motion.div>
              ) : currentBrief ? (
                <motion.div
                  key={currentBrief.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BriefResult brief={currentBrief} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass p-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                    <Wand2 className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white/60 mb-2">
                    No brief generated yet
                  </h3>
                  <p className="text-sm text-white/30 max-w-sm">
                    Enter a project description above, pick a visual style, and
                    click Generate to see your creative brief here.
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
