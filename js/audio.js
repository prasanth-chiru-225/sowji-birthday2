/**
 * ============================================================================
 * HIGH-FIDELITY WEB AUDIO ENGINE
 * ============================================================================
 * Synthesizes ambient lo-fi piano chords, warm music box melodies,
 * and realistic interactive sound effects (candle blow, gift unwrap, paper rustle,
 * confetti poppers). Zero external audio dependencies needed!
 */

class BirthdayAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.isPlaying = false;
    this.timer = null;
    this.barIndex = 0;
    this.volume = 0.75;
    this.analyser = null;
    this.isMuted = false;
    
    // Chord progression: gentle, emotional, warm (Fmaj7 - Em7 - Dm7 - Cmaj7 progression in C/F major)
    this.chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [164.81, 196.00, 246.94, 293.66], // Em7 (E3, G3, B3, D4)
      [146.83, 174.61, 220.00, 261.63], // Dm7 (D3, F3, A3, C4)
      [130.81, 164.81, 196.00, 246.94]  // Cmaj7 (C3, E3, G3, B3)
    ];

    // Melodic arpeggio patterns (music box / celesta)
    this.melodyPatterns = [
      [0, 2, 3, 2, 1, 3, 2, 0],
      [1, 3, 2, 3, 1, 2, 0, 1],
      [2, 0, 1, 3, 2, 1, 3, 2],
      [3, 2, 1, 0, 2, 3, 1, 2]
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    
    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // Analyser for UI visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;

    // Sub-gains
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.65, this.ctx.currentTime);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    // Warm Low-pass filter (gives soft lo-fi acoustic texture)
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(1900, this.ctx.currentTime);

    // Ambient Stereo Delay (Reverb-like spatial warmth)
    this.delay = this.ctx.createDelay();
    this.delay.delayTime.setValueAtTime(0.36, this.ctx.currentTime);

    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.setValueAtTime(0.32, this.ctx.currentTime);

    // Connections
    this.bgmGain.connect(this.filter);
    this.filter.connect(this.masterGain);
    
    // Delay loop
    this.filter.connect(this.delay);
    this.delay.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delay);
    this.delay.connect(this.masterGain);

    // SFX directly to master
    this.sfxGain.connect(this.masterGain);

    // Master to Analyser to Destination
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  async resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  // Play a single synthesized note with ADSR envelope
  playTone(freq, startTime, duration, velocity = 0.08, type = "sine") {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Piano-like ADSR curve
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(velocity, startTime + 0.03); // Attack
    gain.gain.exponentialRampToValueAtTime(velocity * 0.7, startTime + 0.15); // Decay
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // Release

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  // Play one bar of music
  playBar() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime + 0.05;
    const chord = this.chords[this.barIndex % this.chords.length];
    const melody = this.melodyPatterns[this.barIndex % this.melodyPatterns.length];

    // Sustained Bass Note
    this.playTone(chord[0] / 2, now, 3.8, 0.09, "triangle");

    // Sustained Warm Chords
    chord.forEach((freq, i) => {
      this.playTone(freq, now + i * 0.04, 3.6, 0.045, "sine");
    });

    // Delicate Music Box Melody Arpeggio
    melody.forEach((noteIdx, i) => {
      const freq = chord[noteIdx] * 2;
      const noteTime = now + (i * 0.45);
      this.playTone(freq, noteTime, 1.2, 0.04, "triangle");
      // Add subtle harmonic sparkle
      if (i % 2 === 0) {
        this.playTone(freq * 1.5, noteTime + 0.02, 0.8, 0.015, "sine");
      }
    });

    this.barIndex++;
  }

  startBGM() {
    this.resume().then(() => {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.playBar();
      this.timer = setInterval(() => {
        if (this.isPlaying) this.playBar();
      }, 3600);
    });
  }

  stopBGM() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  toggleBGM() {
    if (this.isPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  // ==========================================
  // INTERACTIVE SOUND EFFECTS
  // ==========================================

  // Candle blowout: soft breath woosh + magical fairy chime
  playBlowSound() {
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Breath Woosh (Filtered White Noise)
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 0.5);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.25, now + 0.08);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    whiteNoise.start(now);

    // 2. Sparkle Chimes
    const chimeFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chimeFreqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + 0.2 + idx * 0.06);

      g.gain.setValueAtTime(0, now + 0.2 + idx * 0.06);
      g.gain.linearRampToValueAtTime(0.06, now + 0.23 + idx * 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7 + idx * 0.06);

      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(now + 0.2 + idx * 0.06);
      osc.stop(now + 0.8 + idx * 0.06);
    });
  }

  // Wish Note Unfold: Paper rustle & pleasant wooden kalimba ding
  playNotePullSound() {
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const notes = [440, 554.37, 659.25];
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.08);

      g.gain.setValueAtTime(0, now + i * 0.08);
      g.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.45);
    });
  }

  // Gift Box Open: Celestial Harp glissando + triumphant chime
  playGiftUnwrapSound() {
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Major 9th celestial cascade
    const harpNotes = [261.63, 329.63, 392.00, 493.88, 587.33, 659.25, 783.99, 1046.50];
    harpNotes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + i * 0.06);

      g.gain.setValueAtTime(0, now + i * 0.06);
      g.gain.linearRampToValueAtTime(0.1, now + i * 0.06 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.06 + 0.8);

      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.85);
    });
  }

  // Confetti Popper: Festive double pop
  playConfettiPopSound() {
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [0, 0.09].forEach(delay => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(240, now + delay);
      osc.frequency.exponentialRampToValueAtTime(45, now + delay + 0.12);

      g.gain.setValueAtTime(0.22, now + delay);
      g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.14);

      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(now + delay);
      osc.stop(now + delay + 0.15);
    });
  }
}

// Global audio singleton
window.birthdayAudio = new BirthdayAudioEngine();
