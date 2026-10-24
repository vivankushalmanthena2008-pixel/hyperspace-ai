/**
 * Procedural Web Audio API sound engine for HyperSpace AI
 * Generates futuristic ambient drone pads and tactile UI sound effects
 * Zero external file dependencies or 404 risks.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMusicPlaying = false;
  private oscillators: OscillatorNode[] = [];
  private lfoOscillators: OscillatorNode[] = [];
  private lfoGains: GainNode[] = [];
  private isInitialized = false;

  // State
  public musicEnabled = false;
  public sfxEnabled = true;
  public volume = 0.75;
  public isMuted = false;

  private listeners: Array<() => void> = [];

  constructor() {
    this.loadPreferences();
  }

  private loadPreferences() {
    try {
      const savedMusic = localStorage.getItem('hyperspace_music_enabled');
      const savedSfx = localStorage.getItem('hyperspace_sfx_enabled');
      const savedVol = localStorage.getItem('hyperspace_volume');
      const savedMuted = localStorage.getItem('hyperspace_muted');

      if (savedMusic !== null) this.musicEnabled = savedMusic === 'true';
      if (savedSfx !== null) this.sfxEnabled = savedSfx === 'true';
      if (savedVol !== null) this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
      if (savedMuted !== null) this.isMuted = savedMuted === 'true';
    } catch {
      // localStorage unavailable or restricted
    }
  }

  private savePreferences() {
    try {
      localStorage.setItem('hyperspace_music_enabled', String(this.musicEnabled));
      localStorage.setItem('hyperspace_sfx_enabled', String(this.sfxEnabled));
      localStorage.setItem('hyperspace_volume', String(this.volume));
      localStorage.setItem('hyperspace_muted', String(this.isMuted));
    } catch {
      // Ignore
    }
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  /**
   * Initializes and resumes the AudioContext on the user's first gesture
   * Satisfies modern browser autoplay policies.
   */
  public initOnFirstInteraction() {
    if (this.isInitialized && this.ctx && this.ctx.state === 'running') return;
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    this.isInitialized = true;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      // SFX gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      const effective = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.03);
    }
    this.savePreferences();
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const effective = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(effective, this.ctx.currentTime, 0.03);
    }
    this.savePreferences();
    this.notify();
  }

  public toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    this.savePreferences();
    if (this.musicEnabled) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
    this.notify();
  }

  public toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    this.savePreferences();
    this.notify();
  }

  public startAmbientMusic() {
    const ctx = this.getContext();
    if (!ctx || this.isMusicPlaying) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => this.startAmbientMusic()).catch(() => {});
      return;
    }

    this.isMusicPlaying = true;
    this.stopAmbientNodes();

    // Create a rich futuristic ambient chord: D minor 9 cosmic pads
    const baseFreqs = [73.42, 110.0, 174.61, 261.63, 329.63, 523.25];
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, ctx.currentTime);
    filter.Q.setValueAtTime(2.2, ctx.currentTime);

    // Filter modulation LFO
    const filterLfo = ctx.createOscillator();
    filterLfo.frequency.setValueAtTime(0.1, ctx.currentTime);
    const filterLfoGain = ctx.createGain();
    filterLfoGain.gain.setValueAtTime(260, ctx.currentTime);
    filterLfo.connect(filterLfoGain);
    filterLfoGain.connect(filter.frequency);
    filterLfo.start();
    this.lfoOscillators.push(filterLfo);
    this.lfoGains.push(filterLfoGain);

    if (this.ambientGain) {
      filter.connect(this.ambientGain);
    }

    baseFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime((i - 2.5) * 5, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      const targetGain = 0.15 / Math.sqrt(baseFreqs.length);
      oscGain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 2.5);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();

      this.oscillators.push(osc);
      this.lfoGains.push(oscGain);
    });
  }

  public stopAmbientMusic() {
    if (!this.ctx || !this.isMusicPlaying) return;
    this.isMusicPlaying = false;

    // Smooth fade out
    this.lfoGains.forEach((g) => {
      try {
        g.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 1.0);
      } catch {
        // Ignore
      }
    });

    setTimeout(() => {
      this.stopAmbientNodes();
    }, 1100);
  }

  private stopAmbientNodes() {
    this.oscillators.forEach((o) => {
      try {
        o.stop();
        o.disconnect();
      } catch {
        // Ignore
      }
    });
    this.lfoOscillators.forEach((o) => {
      try {
        o.stop();
        o.disconnect();
      } catch {
        // Ignore
      }
    });
    this.oscillators = [];
    this.lfoOscillators = [];
    this.lfoGains = [];
  }

  // --- Tactile Sound Effects ---

  /**
   * Crisp, high-tech click sound for buttons and interactive controls
   */
  public playClickSound() {
    if (!this.sfxEnabled || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sharp fast pitch blip: 1400Hz dropping to 350Hz in 35ms
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.035);

      // Clean attack and exponential decay
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // AudioContext dropped or suspended
    }
  }

  public playNavSound() {
    if (!this.sfxEnabled || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.065);
    } catch {
      // Ignore audio error
    }
  }

  public playSelectSound() {
    if (!this.sfxEnabled || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(880, now + 0.03);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.085);
    } catch {
      // Ignore
    }
  }

  public playGenerateSound() {
    if (!this.sfxEnabled || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [329.63, 440.0, 659.25, 880.0];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + idx * 0.045;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.24, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        if (this.sfxGain) gain.connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 0.26);
      });
    } catch {
      // Ignore
    }
  }

  public playCopySound() {
    if (!this.sfxEnabled || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now);
      osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.07);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Ignore
    }
  }

  public playToggleSound() {
    if (!this.sfxEnabled || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.02);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // Ignore
    }
  }

  public playSuccessSound() {
    if (!this.sfxEnabled || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [587.33, 739.99, 880.0, 1174.66]; // D major chord
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + idx * 0.04;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        if (this.sfxGain) gain.connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {
      // Ignore
    }
  }
}

export const audioService = new AudioService();

