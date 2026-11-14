/**
 * MedicaOS — Web Audio Ambiance Synthesizer
 * Bộ phát âm thanh Lo-Fi tập trung học tập Y Khoa không cần tải file ngoài
 * Sử dụng thuần HTML5 Web Audio API: Tiếng Mưa Rơi (Rain), Nhịp Tim (Heartbeat), Tiếng Trắng (Pink Noise)
 */

class MedicalAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentMode = 'rain'; // 'rain' | 'heartbeat' | 'noise'
    this.masterGain = null;
    this.volume = 0.5;

    // Node references for continuous sounds
    this.noiseNode = null;
    this.heartbeatTimer = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  playRain() {
    this.stop();
    this.initContext();
    this.currentMode = 'rain';

    // Brown/Pink noise buffer
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain adjustment
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter for smooth rain timbre
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.masterGain);
    whiteNoise.start();

    this.noiseNode = whiteNoise;
    this.isPlaying = true;
    this.updateUIState();
  }

  playHeartbeat() {
    this.stop();
    this.initContext();
    this.currentMode = 'heartbeat';

    // Rhythmic 'lub-dub' stethoscope sound at 70 bpm (~850ms interval)
    const playThump = (freq, duration, decay) => {
      if (!this.ctx || !this.isPlaying) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + decay);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    };

    const beatCycle = () => {
      if (!this.isPlaying) return;
      // Lub (S1)
      playThump(68, 0.16, 0.14);
      // Dub (S2) after 260ms
      setTimeout(() => {
        if (this.isPlaying) playThump(85, 0.13, 0.11);
      }, 260);
    };

    beatCycle();
    this.heartbeatTimer = setInterval(beatCycle, 900); // ~67 bpm
    this.isPlaying = true;
    this.updateUIState();
  }

  playPinkNoise() {
    this.stop();
    this.initContext();
    this.currentMode = 'noise';

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    source.connect(this.masterGain);
    source.start();

    this.noiseNode = source;
    this.isPlaying = true;
    this.updateUIState();
  }

  playCompletionChime() {
    this.initContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + (idx * 0.12);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  }

  stop() {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    this.isPlaying = false;
    this.updateUIState();
  }

  toggleCurrent() {
    if (this.isPlaying) {
      this.stop();
    } else {
      if (this.currentMode === 'rain') this.playRain();
      else if (this.currentMode === 'heartbeat') this.playHeartbeat();
      else this.playPinkNoise();
    }
  }

  updateUIState() {
    const pill = document.getElementById('audioAmbiancePill');
    const label = document.getElementById('audioAmbianceLabel');
    if (!pill) return;

    if (this.isPlaying) {
      pill.classList.add('audio-playing', 'ring-2', 'ring-emerald-500/60');
      if (label) {
        const modeNames = { rain: '🌧 Mưa rơi', heartbeat: '💓 Nhịp tim 70 bpm', noise: '🍃 Tiếng trắng' };
        label.textContent = modeNames[this.currentMode] || 'Đang phát';
      }
    } else {
      pill.classList.remove('audio-playing', 'ring-2', 'ring-emerald-500/60');
      if (label) label.textContent = 'Âm thanh Lo-fi (Tắt)';
    }
  }
}

// Global instance
const medicalAudio = new MedicalAudioEngine();
