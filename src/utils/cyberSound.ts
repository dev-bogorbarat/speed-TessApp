// Cyber Synthesizer using Native Web Audio API
class CyberAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public chimeEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const storedChime = localStorage.getItem('speedt_sound_chime_enabled');
        if (storedChime !== null) {
          this.chimeEnabled = storedChime === 'true';
        }
        const storedMaster = localStorage.getItem('speedt_sound_master_enabled');
        if (storedMaster !== null) {
          this.enabled = storedMaster === 'true';
        }
      } catch {
        // safe fallback
      }
    }
  }

  public setChimeEnabled(val: boolean) {
    this.chimeEnabled = val;
    try {
      localStorage.setItem('speedt_sound_chime_enabled', String(val));
    } catch {
      // safe
    }
  }

  public setMasterEnabled(val: boolean) {
    this.enabled = val;
    try {
      localStorage.setItem('speedt_sound_master_enabled', String(val));
    } catch {
      // safe
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio guarded
    }
  }

  public playPingPulse(pitchMultiplier = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const baseFreq = 520 * pitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio guarded
    }
  }

  public playWarpWhoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(950, this.ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    } catch {
      // Audio guarded
    }
  }

  public playVictoryChime() {
    if (!this.enabled || !this.chimeEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = this.ctx.currentTime + idx * 0.09;
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch {
      // Audio guarded
    }
  }
}

export const cyberSound = new CyberAudioEngine();
