import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ChevronRight } from 'lucide-react';
import type { CreativeBrief } from '@/types';

interface HistoryPanelProps {
  briefs: CreativeBrief[];
  onSelect: (brief: CreativeBrief) => void;
  onClear: () => void;
  activeId?: string;
}

export function HistoryPanel({ briefs, onSelect, onClear, activeId }: HistoryPanelProps) {
  return (
    <div className="glass p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-white/40" />
          <h3 className="text-sm font-semibold text-white/80">Session History</h3>
        </div>
        {briefs.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-white/30 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {briefs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
              <History className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-xs text-white/30 max-w-[200px] mx-auto leading-relaxed">
              Your generated briefs will appear here during this session
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 -mr-2 pr-2">
          <AnimatePresence initial={false}>
            {briefs.map((brief) => (
              <motion.button
                key={brief.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => onSelect(brief)}
                className={`w-full text-left p-3 rounded-xl transition-all group ${
                  activeId === brief.id
                    ? 'bg-cyan-glow/[0.08] border border-cyan-glow/20'
                    : 'bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-medium text-white/80 line-clamp-1">
                    {brief.title}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-colors ${
                    activeId === brief.id ? 'text-cyan-glow' : 'text-white/20 group-hover:text-white/40'
                  }`} />
                </div>
                <p className="text-xs text-white/30 line-clamp-2 leading-relaxed mb-2">
                  {brief.prompt}
                </p>
                <div className="flex items-center gap-1.5">
                  {brief.colorPalette.slice(0, 4).map((c) => (
                    <div
                      key={c.hex}
                      className="w-3 h-3 rounded-full border border-white/10"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  <span className="text-xs text-white/20 ml-1">
                    {new Date(brief.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
