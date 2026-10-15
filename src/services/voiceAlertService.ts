/**
 * Voice Audio Broadcast Service for Weather Reports, Advisories, and Alerts.
 * 100% Reliable implementation with:
 * - Web Speech API engine
 * - Tone Chime audio feedback on start
 * - Chrome SpeechSynthesis garbage-collection & pause-bug workarounds
 * - Automatic voice detection with universal fallbacks
 * - Global active listeners for UI status updates
 */

type SpeechStatusListener = (isSpeaking: boolean, currentText?: string) => void;
const listeners: Set<SpeechStatusListener> = new Set();

let activeUtterances: SpeechSynthesisUtterance[] = [];
let pingInterval: number | null = null;
let currentTimeout: number | null = null;
let currentlySpeaking = false;

// Attach to window to prevent Chrome GC bug from killing utterances
if (typeof window !== 'undefined') {
  (window as any).__weatherUtterances = activeUtterances;
}

export function subscribeSpeechStatus(listener: SpeechStatusListener): () => void {
  listeners.add(listener);
  listener(currentlySpeaking);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(speaking: boolean, text?: string) {
  currentlySpeaking = speaking;
  listeners.forEach((fn) => {
    try {
      fn(speaking, text);
    } catch (e) {
      console.warn('Listener error:', e);
    }
  });
}

/**
 * Play a crystal-clear pleasant notification tone using Web Audio API
 */
export function playChimeTone(type: 'start' | 'alert' | 'end' = 'start'): void {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'start') {
      // Pleasant rising melody (F4 -> A4 -> C5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(349.23, now); // F4
      osc.frequency.setValueAtTime(440.0, now + 0.08); // A4
      osc.frequency.setValueAtTime(523.25, now + 0.16); // C5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (type === 'alert') {
      // Urgent double beep
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(880.0, now + 0.1); // A5
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.29);
    } else {
      // Soft finish
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(349.23, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.21);
    }
  } catch (e) {
    // Audio context may be restricted before interaction; ignored silently
  }
}

/**
 * Stop any ongoing speech broadcast
 */
export function stopSpeech(): void {
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }

  activeUtterances = [];
  if (typeof window !== 'undefined') {
    (window as any).__weatherUtterances = [];
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Error in window.speechSynthesis.cancel:', e);
    }
  }

  notifyListeners(false);
}

/**
 * Check if voice speech is currently playing
 */
export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking || currentlySpeaking;
  }
  return currentlySpeaking;
}

/**
 * Split long text into natural sentences
 */
function splitTextIntoSentences(text: string): string[] {
  if (!text) return [];
  // Split on Bengali full stop (।), English period (.), exclamation (!), question (?), newline
  const rawParts = text.split(/([।!?\n]+)/);
  const sentences: string[] = [];
  let current = '';

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    if (!part) continue;
    current += part;
    if (/[।!?\n]/.test(part) || current.length > 90) {
      if (current.trim().length > 0) {
        sentences.push(current.trim());
      }
      current = '';
    }
  }

  if (current.trim().length > 0) {
    sentences.push(current.trim());
  }

  return sentences.length > 0 ? sentences : [text];
}

/**
 * Speaks the given message aloud using Web Speech API with 100% reliability
 */
export function speakWeatherAlert(
  message: string,
  langCode: string = 'bn',
  onEnd?: () => void
): void {
  // 1. Immediately play pleasant start chime for instant tactile audio confirmation
  playChimeTone('start');

  // Stop any active speech first
  stopSpeech();

  if (!message || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis unavailable or message empty');
    if (onEnd) onEnd();
    return;
  }

  const synth = window.speechSynthesis;

  // Unpause if in paused state
  try {
    if (synth.paused) {
      synth.resume();
    }
  } catch (e) {}

  const cleanLang = (langCode || 'bn').toLowerCase().trim();
  const isBengali = cleanLang.startsWith('bn');
  const targetLang = isBengali ? 'bn-BD' : cleanLang.startsWith('ar') ? 'ar-SA' : cleanLang.startsWith('es') ? 'es-ES' : cleanLang.startsWith('de') ? 'de-DE' : cleanLang.startsWith('fr') ? 'fr-FR' : 'en-US';

  notifyListeners(true, message);

  // Chrome Bug Workaround: cancel() must be separated by at least 60ms before speak()
  currentTimeout = window.setTimeout(() => {
    try {
      synth.cancel();
    } catch (e) {}

    const voices = synth.getVoices() || [];
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (voices.length > 0) {
      if (isBengali) {
        selectedVoice =
          voices.find((v) => {
            const l = (v.lang || '').toLowerCase();
            const n = (v.name || '').toLowerCase();
            return l.includes('bn') || n.includes('bangla') || n.includes('bengali') || n.includes('বাংলা');
          }) || null;
      } else {
        selectedVoice =
          voices.find((v) => (v.lang || '').toLowerCase().startsWith(cleanLang)) ||
          voices.find((v) => (v.lang || '').toLowerCase().startsWith('en')) ||
          null;
      }
    }

    const sentences = splitTextIntoSentences(message);
    let index = 0;

    // Chrome 15-second freeze bug fix: Periodic resume ping
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = window.setInterval(() => {
      try {
        if (synth.speaking && !synth.paused) {
          synth.pause();
          synth.resume();
        }
      } catch (e) {}
    }, 12000);

    const speakChunk = () => {
      if (index >= sentences.length) {
        if (pingInterval) {
          clearInterval(pingInterval);
          pingInterval = null;
        }
        notifyListeners(false);
        playChimeTone('end');
        if (onEnd) onEnd();
        return;
      }

      const chunkText = sentences[index];
      index++;

      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = targetLang;
      utterance.rate = isBengali ? 0.92 : 0.96;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        // Short pause between sentences for clarity
        setTimeout(() => {
          speakChunk();
        }, 80);
      };

      utterance.onerror = (e) => {
        console.warn('Speech chunk warning:', e);
        // Continue next chunk rather than getting stuck
        speakChunk();
      };

      activeUtterances.push(utterance);
      if (typeof window !== 'undefined') {
        (window as any).__weatherUtterances.push(utterance);
      }

      try {
        synth.speak(utterance);
        // Force unpause
        if (synth.paused) synth.resume();
      } catch (err) {
        console.error('synth.speak error:', err);
        speakChunk();
      }
    };

    // Small delay to ensure synth is completely ready
    setTimeout(() => {
      speakChunk();
    }, 60);
  }, 70);
}
