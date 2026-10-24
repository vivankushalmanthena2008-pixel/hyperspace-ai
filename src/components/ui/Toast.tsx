import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onDismiss(toast.id)}
            className="pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl bg-base-900/95 border border-white/10 shadow-xl backdrop-blur-xl cursor-pointer"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                toast.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : toast.type === 'warning'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30'
              }`}
            >
              {toast.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : toast.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Info className="w-4 h-4" />
              )}
            </div>
            <p className="text-xs font-medium text-white/90 leading-tight">{toast.text}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
