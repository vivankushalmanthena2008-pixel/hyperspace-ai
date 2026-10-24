import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { audioService } from '@/services/audioService';

export function AudioController() {
  const [, setTick] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = audioService.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const handleToggleMusic = () => {
    audioService.toggleMusic();
    audioService.playToggleSound();
  };

  const handleToggleMute = () => {
    audioService.toggleMute();
    audioService.playToggleSound();
  };

  const handleToggleSfx = () => {
    audioService.toggleSfx();
    audioService.playToggleSound();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioService.setVolume(val);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="mb-2 p-4 rounded-2xl bg-base-900/95 border border-white/10 backdrop-blur-2xl shadow-2xl w-64 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-cyan-glow" />
                HyperSpace Audio
              </span>
              <button
                onClick={handleToggleMute}
                className="text-xs text-white/40 hover:text-white transition-colors"
                title={audioService.isMuted ? 'Unmute All' : 'Mute All'}
              >
                {audioService.isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-cyan-glow" />
                )}
              </button>
            </div>

            {/* Ambient Music Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-white/80 font-medium">Ambient Music</span>
                <span className="text-[10px] text-white/40">Cosmic drone & pads</span>
              </div>
              <button
                onClick={handleToggleMusic}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  audioService.musicEnabled ? 'bg-cyan-glow' : 'bg-white/10'
                }`}
                role="switch"
                aria-checked={audioService.musicEnabled}
              >
                <motion.div
                  className={`w-5 h-5 rounded-full shadow-md ${
                    audioService.musicEnabled ? 'bg-base-950' : 'bg-white/60'
                  }`}
                  animate={{ x: audioService.musicEnabled ? 22 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* UI SFX Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-white/80 font-medium">UI Sound Effects</span>
                <span className="text-[10px] text-white/40">Tactile clicks & chimes</span>
              </div>
              <button
                onClick={handleToggleSfx}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  audioService.sfxEnabled ? 'bg-indigo-glow' : 'bg-white/10'
                }`}
                role="switch"
                aria-checked={audioService.sfxEnabled}
              >
                <motion.div
                  className={`w-5 h-5 rounded-full shadow-md ${
                    audioService.sfxEnabled ? 'bg-base-950' : 'bg-white/60'
                  }`}
                  animate={{ x: audioService.sfxEnabled ? 22 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Volume slider */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-white/50">
                <span>Master Volume</span>
                <span className="font-mono text-cyan-glow">{Math.round(audioService.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioService.volume}
                onChange={handleVolumeChange}
                disabled={audioService.isMuted}
                className="w-full accent-cyan-glow h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          audioService.playToggleSound();
        }}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full border shadow-xl backdrop-blur-xl transition-all ${
          audioService.musicEnabled
            ? 'bg-base-900/90 border-cyan-glow/40 shadow-[0_0_20px_-3px_rgba(34,211,238,0.35)] text-cyan-glow'
            : 'bg-base-900/80 border-white/10 text-white/60 hover:text-white hover:border-white/20'
        }`}
        aria-label="Audio controller"
      >
        {/* Animated wave bars if music is active */}
        {audioService.musicEnabled && !audioService.isMuted ? (
          <div className="flex items-end gap-[2px] h-3.5 w-3.5">
            <motion.div
              animate={{ height: ['30%', '100%', '40%'] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
              className="w-[2.5px] bg-cyan-glow rounded-full"
            />
            <motion.div
              animate={{ height: ['80%', '20%', '90%'] }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
              className="w-[2.5px] bg-cyan-glow rounded-full"
            />
            <motion.div
              animate={{ height: ['40%', '90%', '20%'] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
              className="w-[2.5px] bg-cyan-glow rounded-full"
            />
          </div>
        ) : (
          <Music className="w-3.5 h-3.5" />
        )}

        <span className="text-xs font-medium tracking-tight">
          {audioService.isMuted
            ? 'Muted'
            : audioService.musicEnabled
            ? 'Ambient Audio'
            : 'Sound FX'}
        </span>

        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </motion.button>
    </div>
  );
}
