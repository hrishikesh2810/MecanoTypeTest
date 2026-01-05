import { audio, initAudio, playSound } from './audio.js';
import { config } from './config.js';
import { data, i18n, applyTranslations, loadWords } from './data.js';
import { game, initGame, generateWords, renderWords, updateCursor, updateZenCursor, handleZenInput, handleKeydown, finishGame } from './game.js';
import { stats, userStats, currentSort, saveUserStats, renderUserStats, renderGlobalStatsTable } from './stats.js';
import { t, startTimer, stopTimer, formatTime} from './utils.js';

export const ui = {
    currentView: 'game',
    paperScrollY: 100,
};

export const timerContainer = document.getElementById('timer-container');
export const timerDisplay = document.getElementById('timer-display');

export const gameArea = document.getElementById('game-area');
export const wordsContainer = document.getElementById('words');
export const statsContainer = document.getElementById('stats');
export const wpmEl = document.getElementById('wpm');
export const accEl = document.getElementById('acc');
export const errorsEl = document.getElementById('errors');
export const weakKeysEl = document.getElementById('weak-keys');
export const restartBtn = document.getElementById('restart-button');
export const soundBtn = document.getElementById('sound-btn');
export const suddenDeathBtn = document.getElementById('sudden-death-btn');
export const numbersBtn = document.getElementById('numbers-btn');
export const uppercaseBtn = document.getElementById('uppercase-btn');
export const symbolsBtn = document.getElementById('symbols-btn');
export const zenBtn = document.getElementById('zen-btn');
export const settingsBtn = document.getElementById('settings-btn');
export const closeSettingsBtn = document.getElementById('close-settings-btn');
export const statsBtn = document.getElementById('stats-btn');
export const closeStatsBtn = document.getElementById('close-stats-btn');
export const resetStatsBtn = document.getElementById('reset-stats-btn');
export const globalStatsTableBody = document.querySelector('#global-stats-table tbody');
export const mobileInput = document.getElementById('mobile-input');

export function updateTimerDisplay() {
    timerDisplay.textContent = game.timeLeft;
}

export function updateSettingsVisibility() {
    const wordsSetting = document.getElementById('setting-words-count');
    const timeSetting = document.getElementById('setting-time-limit');

    if (config.gameMode === 'time') {
        wordsSetting.classList.add('hidden');
        timeSetting.classList.remove('hidden');
    } else {
        wordsSetting.classList.remove('hidden');
        timeSetting.classList.add('hidden');
    }
}

export function switchView(newView) {
    if (ui.currentView === newView) return;
    
    // Update timer visibility only when leaving the game view.
    if (ui.currentView === 'game' && config.gameMode === 'time') {
        timerContainer.classList.add('hidden');
    }
    
    playSound('tear');
    const oldPaper = gameArea.cloneNode(true);
    oldPaper.id = 'old-paper';
    oldPaper.style.position = 'absolute';
    oldPaper.style.top = '0';
    oldPaper.style.left = '0';
    oldPaper.style.width = '100%';
    oldPaper.style.height = '100%';
    oldPaper.style.zIndex = '10';
    oldPaper.style.transform = gameArea.style.transform || 'translateY(100px)';
    oldPaper.style.transition = 'none';
    
    oldPaper.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

    gameArea.parentElement.appendChild(oldPaper);
    void oldPaper.offsetWidth;
    oldPaper.classList.add('tearing');
    oldPaper.style.transition = 'transform 0.6s ease-in, opacity 0.6s ease-in';
    oldPaper.style.transform = 'translate(1000px, -200px) rotate(15deg)';
    oldPaper.style.opacity = '0';
    setTimeout(() => oldPaper.remove(), 600);

    ui.currentView = newView;
    
    document.getElementById('words').classList.add('hidden');
    document.getElementById('settings-sheet').classList.add('hidden');
    document.getElementById('stats-sheet').classList.add('hidden');
    statsContainer.classList.add('hidden');
    document.getElementById('restart-note').classList.add('hidden');
    restartBtn.classList.add('hidden');

    ui.paperScrollY = 100;
    gameArea.style.transition = 'none';
    gameArea.style.transform = 'translateY(100%)';

    if (newView === 'game') {
        initGame(false); 
    } else if (newView === 'settings') {
        document.getElementById('settings-sheet').classList.remove('hidden');
    } else if (newView === 'stats') {
        document.getElementById('stats-sheet').classList.remove('hidden');
        renderGlobalStatsTable();
        renderUserStats();
    }

    settingsBtn.classList.toggle('active', newView === 'settings');
    statsBtn.classList.toggle('active', newView === 'stats');

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            gameArea.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            gameArea.style.transform = `translateY(${ui.paperScrollY}px)`;
        });
    });
}

export function showZenPopup(btn, enabled) {
    const popup = document.createElement('div');
    popup.className = 'zen-popup';
    popup.textContent = `${t('settings.zenMode')} ${enabled ? t('settings.on') : t('settings.off')}`;
    Object.assign(popup.style, {
        position: 'absolute',
        zIndex: 9999,
        padding: '6px 10px',
        background: 'rgba(0,0,0,0.85)',
        color: '#fff',
        borderRadius: '6px',
        fontSize: '13px',
        whiteSpace: 'nowrap',
        opacity: '0',
        transform: 'translateY(0)',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
        pointerEvents: 'none'
    });

    document.body.appendChild(popup);

    const rect = btn.getBoundingClientRect();

    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top = `${rect.top - 10}px`;

    requestAnimationFrame(() => {
        const r = btn.getBoundingClientRect();
        const left = r.left + r.width / 2 - popup.offsetWidth / 2;
        const top = r.top - popup.offsetHeight - 8;
        popup.style.left = `${Math.max(8, left)}px`;
        popup.style.top = `${Math.max(8, top)}px`;
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(-4px)';
    });

    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(0)';
        setTimeout(() => popup.remove(), 200);
    }, 1000);
}