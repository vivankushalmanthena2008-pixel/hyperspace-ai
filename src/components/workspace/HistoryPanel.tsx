import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ChevronRight, FileText } from 'lucide-react';
import type { CreativeBrief } from '@/types';
import { audioService } from '@/services/audioService';

interface HistoryPanelProps {
  briefs: CreativeBrief[];
  onSelect: (brief: CreativeBrief) => void;
  onClear: () => void;
  activeId?: string;
}

export function HistoryPanel({ briefs, onSelect, onClear, activeId }: HistoryPanelProps) {
  return (
    <div className="glass p-5 rounded-2xl border border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-glow" />
          <h3 className="text-sm font-semibold text-white/90">Session History</h3>
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-white/5 font-mono text-white/40">
            {briefs.length}
          </span>
        </div>
        {briefs.length > 0 && (
          <button
            onClick={() => {
              audioService.playToggleSound();
              onClear();
            }}
            className="text-xs text-white/40 hover:text-red-400 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 rounded px-1.5 py-0.5"
            title="Clear all session history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {briefs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-xs text-white/40 max-w-[200px] mx-auto leading-relaxed">
              Your generated briefs will appear here to review and switch between anytime during this session.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 -mr-1.5 pr-1.5">
          <AnimatePresence initial={false}>
            {briefs.map((brief) => (
              <motion.button
                key={brief.id}
                layout
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                onClick={() => {
                  audioService.playSelectSound();
                  onSelect(brief);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all group ${
                  activeId === brief.id
                    ? 'bg-cyan-glow/[0.12] border border-cyan-glow/40 shadow-[0_0_20px_-4px_rgba(34,211,238,0.3)]'
                    : 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10'
                }`}
                aria-pressed={activeId === brief.id}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-white/90 line-clamp-1">
                    {brief.title}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-colors ${
                      activeId === brief.id ? 'text-cyan-glow' : 'text-white/20 group-hover:text-white/50'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed mb-2 font-sans">
                  {brief.prompt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {brief.colorPalette.slice(0, 4).map((c) => (
                      <div
                        key={c.hex}
                        className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} (${c.hex})`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/30 font-mono">
                    {new Date(brief.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
