import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Palette,
  Type,
  Image,
  ListChecks,
  Sparkles,
  Info,
  Download,
  CheckCircle,
  Circle,
} from 'lucide-react';
import type { CreativeBrief } from '@/types';
import { CinematicButton } from '@/components/ui/CinematicButton';
import { audioService } from '@/services/audioService';

interface BriefResultProps {
  brief: CreativeBrief;
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export function BriefResult({ brief, onShowToast }: BriefResultProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const copyToClipboard = (text: string, field: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      audioService.playCopySound();
      setCopiedField(field);
      if (onShowToast) {
        onShowToast(`Copied ${label} to clipboard!`, 'success');
      }
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const copyFullBrief = () => {
    const fullText = [
      `# CREATIVE BRIEF: ${brief.title}`,
      '',
      `**Prompt:** ${brief.prompt}`,
      `**Visual Style:** ${brief.style.replace(/-/g, ' ')}`,
      `**Generated On:** ${new Date(brief.createdAt).toLocaleString()}`,
      '',
      '## CONCEPT',
      brief.concept,
      '',
      '## VISUAL DIRECTION',
      brief.visualDirection,
      '',
      '## COLOR PALETTE',
      ...brief.colorPalette.map((c) => `- **${c.name}** (\`${c.hex}\`): ${c.usage}`),
      '',
      '## TYPOGRAPHY',
      brief.typography,
      '',
      '## MOOD KEYWORDS',
      brief.moodKeywords.map((k) => `\`${k}\``).join(', '),
      '',
      '## SUGGESTED ASSETS',
      ...brief.suggestedAssets.map((a) => `- [ ] ${a}`),
      '',
      '## NEXT STEPS CHECKLIST',
      ...brief.nextSteps.map((s, i) => `${i + 1}. [ ] ${s}`),
    ].join('\n');

    copyToClipboard(fullText, 'full', 'Full Creative Brief');
  };

  const handleDownloadMarkdown = () => {
    audioService.playCopySound();
    const markdownContent = [
      `# ${brief.title}`,
      '',
      `> Generated via HyperSpace AI on ${new Date(brief.createdAt).toLocaleDateString()}`,
      `> Style: ${brief.style}`,
      '',
      '## 1. Project Prompt',
      brief.prompt,
      '',
      '## 2. Concept Summary',
      brief.concept,
      '',
      '## 3. Visual Direction',
      brief.visualDirection,
      '',
      '## 4. Color Palette',
      ...brief.colorPalette.map((c) => `- **${c.name}** (\`${c.hex}\`): ${c.usage}`),
      '',
      '## 5. Typography Recommendation',
      brief.typography,
      '',
      '## 6. Suggested Creative Assets',
      ...brief.suggestedAssets.map((a) => `- [ ] ${a}`),
      '',
      '## 7. Actionable Next Steps',
      ...brief.nextSteps.map((s, i) => `${i + 1}. [ ] ${s}`),
    ].join('\n\n');

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = brief.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    link.href = url;
    link.download = `hyperspace-brief-${safeTitle}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast(`Downloaded brief as Markdown (.md)`, 'success');
    }
  };

  const toggleStep = (index: number) => {
    audioService.playToggleSound();
    setCompletedSteps((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      const completedCount = Object.values(next).filter(Boolean).length;
      if (next[index] && onShowToast && completedCount === brief.nextSteps.length) {
        onShowToast('All roadmap steps completed! Ready to launch.', 'success');
      }
      return next;
    });
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Generation mode badge */}
      {brief.isDemo ? (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-400/[0.06] border border-amber-400/20">
          <Info className="w-4 h-4 text-amber-400/80 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/80 leading-relaxed">
            {brief.demoNote || 'Generated in simulation mode. Provides authentic, production-grade creative direction.'}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 p-2.5 px-3.5 rounded-xl bg-cyan-glow/[0.08] border border-cyan-glow/30 shadow-sm">
          <Sparkles className="w-4 h-4 text-cyan-glow flex-shrink-0" />
          <p className="text-xs text-cyan-200 font-medium">
            Live AI Generation · Tailored and synthesized by Gemini 3.8 Flash
          </p>
        </div>
      )}

      {/* Header */}
      <div className="glass-strong p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-gradient mb-1">
              {brief.title}
            </h3>
            <p className="text-xs text-white/40 font-mono capitalize">
              Style: {brief.style.replace(/-/g, ' ')}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <CinematicButton
              variant="ghost"
              size="sm"
              onClick={copyFullBrief}
              className="text-xs"
            >
              {copiedField === 'full' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy All
                </>
              )}
            </CinematicButton>
            <CinematicButton
              variant="glow"
              size="sm"
              onClick={handleDownloadMarkdown}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 text-cyan-glow" />
              Download .md
            </CinematicButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {brief.moodKeywords.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] text-cyan-glow/80 border border-white/[0.08]"
            >
              #{kw}
            </span>
          ))}
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">Concept</h4>
          <p className="text-sm text-white/80 leading-relaxed">{brief.concept}</p>
        </div>
      </div>

      {/* Visual Direction */}
      <div className="glass p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-glow" />
            <h4 className="text-sm font-semibold text-white">Visual Direction</h4>
          </div>
          <button
            onClick={() => copyToClipboard(brief.visualDirection, 'visualDirection', 'Visual Direction')}
            className="text-white/30 hover:text-cyan-glow transition-colors p-1"
            title="Copy visual direction"
          >
            {copiedField === 'visualDirection' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">{brief.visualDirection}</p>
      </div>

      {/* Color Palette */}
      <div className="glass p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-glow" />
            <h4 className="text-sm font-semibold text-white">Color Palette</h4>
          </div>
          <span className="text-xs text-white/30">Click any swatch to copy HEX</span>
        </div>
        <div className="space-y-2.5">
          {brief.colorPalette.map((color) => (
            <div
              key={color.hex}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all group cursor-pointer"
              onClick={() => copyToClipboard(color.hex, color.name, `${color.name} (${color.hex})`)}
            >
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0 border border-white/10 transition-transform group-hover:scale-105 shadow-md"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/90 font-medium">{color.name}</div>
                <div className="text-xs text-cyan-glow/80 font-mono">{color.hex}</div>
              </div>
              <div className="text-xs text-white/40 hidden sm:block">{color.usage}</div>
              <div className="flex-shrink-0">
                {copiedField === color.name ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white/20 group-hover:text-cyan-glow transition-colors" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="glass p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-violet-glow" />
            <h4 className="text-sm font-semibold text-white">Typography</h4>
          </div>
          <button
            onClick={() => copyToClipboard(brief.typography, 'typography', 'Typography')}
            className="text-white/30 hover:text-cyan-glow transition-colors p-1"
            title="Copy typography"
          >
            {copiedField === 'typography' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-sm text-white/70 leading-relaxed font-mono text-xs bg-base-950/40 p-3 rounded-lg border border-white/5">
          {brief.typography}
        </p>
      </div>

      {/* Suggested Assets */}
      <div className="glass p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Image className="w-4 h-4 text-cyan-glow" />
          <h4 className="text-sm font-semibold text-white">Suggested Assets</h4>
        </div>
        <ul className="space-y-2.5">
          {brief.suggestedAssets.map((asset, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow mt-2 flex-shrink-0" />
              <span>{asset}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Steps with Interactive Checkboxes */}
      <div className="glass p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-indigo-glow" />
            <h4 className="text-sm font-semibold text-white">Actionable Next Steps</h4>
          </div>
          <span className="text-xs font-mono text-cyan-glow">
            {completedCount} of {brief.nextSteps.length} completed
          </span>
        </div>

        <ol className="space-y-2.5">
          {brief.nextSteps.map((step, i) => {
            const isDone = !!completedSteps[i];
            return (
              <li
                key={i}
                onClick={() => toggleStep(i)}
                className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                  isDone ? 'bg-white/[0.01] opacity-50' : 'bg-white/[0.03] hover:bg-white/[0.05]'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 flex-shrink-0 focus:outline-none"
                  aria-label={isDone ? 'Mark step incomplete' : 'Mark step complete'}
                >
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/30 hover:text-cyan-glow" />
                  )}
                </button>
                <span
                  className={`text-sm leading-relaxed transition-all ${
                    isDone ? 'line-through text-white/35' : 'text-white/80'
                  }`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </motion.div>
  );
}
