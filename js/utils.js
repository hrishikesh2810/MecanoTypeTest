import { audio, initAudio, playSound } from './audio.js';
import { config } from './config.js';
import { data, i18n, applyTranslations, loadWords } from './data.js';
import { game, initGame, generateWords, renderWords, updateCursor, updateZenCursor, handleZenInput, handleKeydown, finishGame } from './game.js';
import { stats, userStats, currentSort, saveUserStats, renderUserStats, renderGlobalStatsTable } from './stats.js';
import { ui, timerContainer, timerDisplay, gameArea, wordsContainer, statsContainer, wpmEl, accEl, errorsEl, weakKeysEl, restartBtn, soundBtn, suddenDeathBtn, numbersBtn, uppercaseBtn, symbolsBtn, zenBtn, settingsBtn, closeSettingsBtn, statsBtn, closeStatsBtn, resetStatsBtn, globalStatsTableBody, mobileInput, updateTimerDisplay, updateSettingsVisibility, switchView, showZenPopup } from './ui.js';

export function t(key) {
    return i18n[config.currentLanguage]?.[key] || i18n.en?.[key] || key;
}

export function startTimer() {
    clearInterval(config.timerInterval);
    game.timeLeft = config.timeLimit;
    updateTimerDisplay();

    timerContainer.classList.remove('hidden');

    config.timerInterval = setInterval(() => {
        game.timeLeft--;
        updateTimerDisplay();

        if (game.timeLeft <= 0) {
            clearInterval(config.timerInterval);
            finishGame();
        } else if (game.timeLeft <= 5) {
            timerContainer.classList.add('danger');
        }
    }, 1000);
}

export function stopTimer() {
    clearInterval(config.timerInterval);
    timerContainer.classList.remove('danger');
}

export function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}