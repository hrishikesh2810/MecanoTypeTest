import { config } from './config.js';
import { i18n } from './data.js';
import { game, finishGame } from './game.js';
import { timerContainer, updateTimerDisplay } from './ui.js';

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