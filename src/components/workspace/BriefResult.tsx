import { motion } from 'framer-motion';
import { Copy, Check, Palette, Type, Image, ListChecks, Sparkles, Info } from 'lucide-react';
import { useState } from 'react';
import type { CreativeBrief } from '@/types';

interface BriefResultProps {
  brief: CreativeBrief;
}

export function BriefResult({ brief }: BriefResultProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const copyFullBrief = () => {
    const fullText = [
      `CREATIVE BRIEF: ${brief.title}`,
      '',
      `Prompt: ${brief.prompt}`,
      `Style: ${brief.style}`,
      '',
      'CONCEPT:',
      brief.concept,
      '',
      'VISUAL DIRECTION:',
      brief.visualDirection,
      '',
      'COLOR PALETTE:',
      ...brief.colorPalette.map((c) => `  ${c.name} (${c.hex}) — ${c.usage}`),
      '',
      'TYPOGRAPHY:',
      brief.typography,
      '',
      'MOOD KEYWORDS:',
      brief.moodKeywords.join(', '),
      '',
      'SUGGESTED ASSETS:',
      ...brief.suggestedAssets.map((a) => `  - ${a}`),
      '',
      'NEXT STEPS:',
      ...brief.nextSteps.map((s, i) => `  ${i + 1}. ${s}`),
    ].join('\n');
    copyToClipboard(fullText, 'full');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Demo disclaimer */}
      {brief.isDemo && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-400/[0.06] border border-amber-400/20">
          <Info className="w-4 h-4 text-amber-400/80 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/70 leading-relaxed">
            This brief was generated in demo mode using structured templates —
            not a live AI model. Results are simulated for demonstration.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="glass-strong p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-gradient mb-1">
              {brief.title}
            </h3>
            <p className="text-xs text-white/30 font-mono">
              Style: {brief.style.replace(/-/g, ' ')}
            </p>
          </div>
          <button
            onClick={copyFullBrief}
            className="btn-ghost text-xs py-2 px-3 flex-shrink-0"
          >
            {copiedField === 'full' ? (
              <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copy All</>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {brief.moodKeywords.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] text-white/50 border border-white/[0.06]"
            >
              {kw}
            </span>
          ))}
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">Concept</h4>
          <p className="text-sm text-white/70 leading-relaxed">{brief.concept}</p>
        </div>
      </div>

      {/* Visual Direction */}
      <div className="glass p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-glow" />
          <h4 className="text-sm font-semibold text-white">Visual Direction</h4>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">{brief.visualDirection}</p>
      </div>

      {/* Color Palette */}
      <div className="glass p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-indigo-glow" />
          <h4 className="text-sm font-semibold text-white">Color Palette</h4>
        </div>
        <div className="space-y-2.5">
          {brief.colorPalette.map((color) => (
            <div
              key={color.hex}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer"
              onClick={() => copyToClipboard(color.hex, color.name)}
            >
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0 border border-white/10 transition-transform group-hover:scale-105"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/80">{color.name}</div>
                <div className="text-xs text-white/30 font-mono">{color.hex}</div>
              </div>
              <div className="text-xs text-white/30 hidden sm:block">{color.usage}</div>
              <div className="flex-shrink-0">
                {copiedField === color.name ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="glass p-6">
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-violet-glow" />
          <h4 className="text-sm font-semibold text-white">Typography</h4>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">{brief.typography}</p>
      </div>

      {/* Suggested Assets */}
      <div className="glass p-6">
        <div className="flex items-center gap-2 mb-4">
          <Image className="w-4 h-4 text-cyan-glow" />
          <h4 className="text-sm font-semibold text-white">Suggested Assets</h4>
        </div>
        <ul className="space-y-2.5">
          {brief.suggestedAssets.map((asset, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow/50 mt-2 flex-shrink-0" />
              {asset}
            </li>
          ))}
        </ul>
      </div>

      {/* Next Steps */}
      <div className="glass p-6">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks className="w-4 h-4 text-indigo-glow" />
          <h4 className="text-sm font-semibold text-white">Next Steps</h4>
        </div>
        <ol className="space-y-3">
          {brief.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-white/60">
              <span className="w-6 h-6 rounded-full bg-indigo-glow/10 border border-indigo-glow/20 flex items-center justify-center text-xs font-mono text-indigo-glow flex-shrink-0">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}
