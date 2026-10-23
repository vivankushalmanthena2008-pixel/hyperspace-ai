import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface OrbProps {
  size?: number;
  className?: string;
}

export function HoloOrb({ size = 400, className = '' }: OrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

  const orbRotateX = useTransform(rotateX, (v) => `${v}deg`);
  const orbRotateY = useTransform(rotateY, (v) => `${v}deg`);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      rotateY.set(dx * 30);
      rotateX.set(-dy * 30);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [rotateX, rotateY]);

  return (
    <div
      ref={containerRef}
      className={`perspective-1000 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="preserve-3d relative"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          rotateX: orbRotateX,
          rotateY: orbRotateY,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        {/* Core sphere */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 30%, rgba(34,211,238,0.9) 0%, rgba(129,140,248,0.6) 30%, rgba(167,139,250,0.3) 60%, transparent 80%)',
            filter: 'blur(2px)',
          }}
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Inner glow */}
        <motion.div
          className="absolute inset-[15%] rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.4) 0%, rgba(34,211,238,0.2) 40%, transparent 70%)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Orbit ring 1 */}
        <motion.div
          className="absolute inset-0 rounded-full border border-cyan-glow/30"
          style={{ transform: 'rotateX(75deg)' }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute w-3 h-3 rounded-full bg-cyan-glow"
            style={{
              top: '-6px',
              left: '50%',
              marginLeft: '-6px',
              boxShadow: '0 0 20px 4px rgba(34,211,238,0.8)',
            }}
          />
        </motion.div>

        {/* Orbit ring 2 */}
        <motion.div
          className="absolute inset-[8%] rounded-full border border-indigo-glow/25"
          style={{ transform: 'rotateX(70deg) rotateZ(45deg)' }}
          animate={{ rotateZ: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-indigo-glow"
            style={{
              top: '-5px',
              left: '50%',
              marginLeft: '-5px',
              boxShadow: '0 0 15px 3px rgba(129,140,248,0.7)',
            }}
          />
        </motion.div>

        {/* Orbit ring 3 */}
        <motion.div
          className="absolute inset-[16%] rounded-full border border-violet-glow/20"
          style={{ transform: 'rotateX(65deg) rotateZ(-30deg)' }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute w-2 h-2 rounded-full bg-violet-glow"
            style={{
              top: '-4px',
              left: '50%',
              marginLeft: '-4px',
              boxShadow: '0 0 12px 3px rgba(167,139,250,0.6)',
            }}
          />
        </motion.div>

        {/* Vertical ring */}
        <motion.div
          className="absolute inset-[5%] rounded-full border border-white/10"
          style={{ transform: 'rotateY(90deg)' }}
          animate={{ rotateX: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />

        {/* Outer atmospheric glow */}
        <div
          className="absolute -inset-[20%] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(129,140,248,0.08) 40%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Scan line */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          style={{ transform: 'rotateX(75deg)' }}
        >
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-glow/60 to-transparent"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
