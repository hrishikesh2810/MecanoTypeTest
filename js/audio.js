import { config } from './config.js';
import { data, i18n, applyTranslations, loadWords } from './data.js';
import { game, initGame, generateWords, renderWords, updateCursor, updateZenCursor, handleZenInput, handleKeydown, finishGame } from './game.js';
import { stats, userStats, currentSort, saveUserStats, renderUserStats, renderGlobalStatsTable } from './stats.js';
import { ui, timerContainer, timerDisplay, gameArea, wordsContainer, statsContainer, wpmEl, accEl, errorsEl, weakKeysEl, restartBtn, soundBtn, suddenDeathBtn, numbersBtn, uppercaseBtn, symbolsBtn, zenBtn, settingsBtn, closeSettingsBtn, statsBtn, closeStatsBtn, resetStatsBtn, globalStatsTableBody, mobileInput, updateTimerDisplay, updateSettingsVisibility, switchView, showZenPopup } from './ui.js';
import { t, startTimer, stopTimer, formatTime} from './utils.js';

export const audio = {
    soundEnabled: true,
    audioCtx: null,
    noiseBuffer: null,
};

export function initAudio() {
    if (!audio.audioCtx) {
        audio.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audio.audioCtx.sampleRate * 2;
        audio.noiseBuffer = audio.audioCtx.createBuffer(1, bufferSize, audio.audioCtx.sampleRate);
        const data = audio.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
    }
}

export function playSound(type) {
    if (!audio.soundEnabled || !audio.audioCtx) return;
    
    if (audio.audioCtx.state === 'suspended') {
        audio.audioCtx.resume();
    }

    const t = audio.audioCtx.currentTime;

    if (type === 'click') {
        const impact = audio.audioCtx.createBufferSource();
        impact.buffer = audio.noiseBuffer;
        const impactFilter = audio.audioCtx.createBiquadFilter();
        impactFilter.type = 'lowpass';
        impactFilter.frequency.value = 800;
        const impactGain = audio.audioCtx.createGain();
        
        impact.connect(impactFilter);
        impactFilter.connect(impactGain);
        impactGain.connect(audio.audioCtx.destination);
        
        impact.start(t, Math.random() * 1.0);
        impactGain.gain.setValueAtTime(0.8, t);
        impactGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        impact.stop(t + 0.06);

        const body = audio.audioCtx.createOscillator();
        body.type = 'triangle';
        body.frequency.setValueAtTime(150 + Math.random() * 30, t); 
        body.frequency.exponentialRampToValueAtTime(40, t + 0.08);
        const bodyGain = audio.audioCtx.createGain();
        
        body.connect(bodyGain);
        bodyGain.connect(audio.audioCtx.destination);
        
        bodyGain.gain.setValueAtTime(0.5, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        
        body.start(t);
        body.stop(t + 0.1);

        const texture = audio.audioCtx.createBufferSource();
        texture.buffer = audio.noiseBuffer;
        const textureFilter = audio.audioCtx.createBiquadFilter();
        textureFilter.type = 'bandpass';
        textureFilter.frequency.value = 400;
        textureFilter.Q.value = 1;
        const textureGain = audio.audioCtx.createGain();
        
        texture.connect(textureFilter);
        textureFilter.connect(textureGain);
        textureGain.connect(audio.audioCtx.destination);
        
        texture.start(t, Math.random() * 1.0);
        textureGain.gain.setValueAtTime(0.4, t);
        textureGain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
        texture.stop(t + 0.05);

    } else if (type === 'error') {
        const thud = audio.audioCtx.createOscillator();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(150, t);
        thud.frequency.exponentialRampToValueAtTime(50, t + 0.2);
        
        const thudGain = audio.audioCtx.createGain();
        thudGain.gain.setValueAtTime(2.0, t);
        thudGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        
        thud.connect(thudGain);
        thudGain.connect(audio.audioCtx.destination);
        
        thud.start(t);
        thud.stop(t + 0.2);
        
        const noise = audio.audioCtx.createBufferSource();
        noise.buffer = audio.noiseBuffer;
        const noiseFilter = audio.audioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 300;
        const noiseGain = audio.audioCtx.createGain();
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(audio.audioCtx.destination);
        
        noise.start(t, Math.random());
        noiseGain.gain.setValueAtTime(2.5, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        noise.stop(t + 0.2);
    } else if (type === 'tear') {
        const duration = 0.55;
        
        const slide = audio.audioCtx.createBufferSource();
        slide.buffer = audio.noiseBuffer;
        
        const slideFilter = audio.audioCtx.createBiquadFilter();
        slideFilter.type = 'lowpass';
        slideFilter.Q.value = 0.6; 
        
        slideFilter.frequency.setValueAtTime(150, t);
        slideFilter.frequency.exponentialRampToValueAtTime(500, t + duration);
        
        const slideGain = audio.audioCtx.createGain();
        slideGain.gain.setValueAtTime(0, t);

        slideGain.gain.linearRampToValueAtTime(0.35, t + 0.08);
        slideGain.gain.linearRampToValueAtTime(0.25, t + duration - 0.15);
        slideGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        
        slide.connect(slideFilter);
        slideFilter.connect(slideGain);
        slideGain.connect(audio.audioCtx.destination);
        
        slide.start(t);
        slide.stop(t + duration);
    }
}
