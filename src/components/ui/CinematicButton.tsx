import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { audioService } from '@/services/audioService';

interface CinematicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'glow' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  silent?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CinematicButton({
  variant = 'primary',
  size = 'md',
  children,
  active = false,
  className = '',
  disabled = false,
  silent = false,
  onClick,
  ...props
}: CinematicButtonProps) {
  const { reducedMotion } = useMediaQuery();
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!silent) {
      audioService.playClickSound();
    }

    if (!reducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleId = Date.now();
      setRipples((prev) => [...prev.slice(-3), { x, y, id: rippleId }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 700);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5 font-semibold',
  }[size];

  const variantClasses = {
    primary:
      'text-base-950 font-medium bg-gradient-to-r from-cyan-glow via-[#5eead4] to-indigo-glow shadow-[0_0_20px_-3px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_0px_rgba(34,211,238,0.65)] hover:brightness-105 active:brightness-95 border border-cyan-300/40',
    ghost:
      'text-white/85 font-medium bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-cyan-glow/40 hover:text-white hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.25)]',
    glow:
      'text-white font-medium bg-gradient-to-r from-cyan-glow/20 via-indigo-glow/20 to-violet-glow/20 border border-cyan-glow/40 hover:border-cyan-glow/70 shadow-[0_0_25px_-5px_rgba(129,140,248,0.4)] hover:shadow-[0_0_35px_0px_rgba(34,211,238,0.5)]',
    danger:
      'text-red-300 font-medium bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-200',
  }[variant];

  const activeClasses = active
    ? 'ring-2 ring-cyan-glow shadow-[0_0_25px_0px_rgba(34,211,238,0.6)] border-cyan-glow/80'
    : '';

  return (
    <motion.button
      whileHover={reducedMotion || disabled ? undefined : { scale: 1.025, y: -1 }}
      whileTap={reducedMotion || disabled ? undefined : { scale: 0.97, y: 1 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      disabled={disabled}
      onClick={handleClick}
      className={`relative overflow-hidden inline-flex items-center justify-center select-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${activeClasses} ${className}`}
      {...props}
    >
      {/* Light sweep animation layer */}
      {!reducedMotion && !disabled && (
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-out"
          style={{ willChange: 'transform' }}
        />
      )}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 3.5, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="pointer-events-none absolute rounded-full bg-white/30"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}

      <span className="relative z-10 flex items-center gap-inherit leading-none">{children}</span>
    </motion.button>
  );
}
