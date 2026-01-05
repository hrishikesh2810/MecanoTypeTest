import { audio, initAudio, playSound } from './audio.js';
import { config } from './config.js';
import { data, i18n, applyTranslations, loadWords } from './data.js';
import { game, initGame, generateWords, renderWords, updateCursor, updateZenCursor, handleZenInput, handleKeydown, finishGame, restartGame } from './game.js';
import { stats, userStats, currentSort, saveUserStats, renderUserStats, renderGlobalStatsTable } from './stats.js';
import { ui, timerContainer, timerDisplay, gameArea, wordsContainer, statsContainer, wpmEl, accEl, errorsEl, weakKeysEl, restartBtn, soundBtn, suddenDeathBtn, numbersBtn, uppercaseBtn, symbolsBtn, zenBtn, settingsBtn, closeSettingsBtn, statsBtn, closeStatsBtn, resetStatsBtn, globalStatsTableBody, mobileInput, updateTimerDisplay, updateSettingsVisibility, switchView, showZenPopup, toggleZenMode, toggleDarkMode, changeAudioIcon, toggleTheme, toggleMobile, initButtons, scrollPaper } from './ui.js';
import { t, startTimer, stopTimer, formatTime} from './utils.js';

toggleDarkMode();

scrollPaper();

applyTranslations();

document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === config.currentLanguage);
});

toggleZenMode();

loadWords().then(() => {
    initGame();
});

changeAudioIcon();

window.addEventListener('resize', updateCursor);

initButtons();

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        stats.currentFilter = btn.dataset.filter;
        renderGlobalStatsTable();
    });
});

document.querySelectorAll('#global-stats-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
        const column = th.dataset.sort;
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'desc';
        }
        renderGlobalStatsTable();
    });
});

document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
        config.currentLanguage = btn.dataset.lang;
        localStorage.setItem('mecano_language', config.currentLanguage);
        
        document.querySelectorAll('[data-lang]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        applyTranslations();
        if(ui.currentView === 'game' && typeof initGame === 'function'){
            initGame(false, false);
        }
        if(ui.currentView === 'stats'){
            renderGlobalStatsTable();
        }
    });
});

document.querySelectorAll('[data-count]').forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.dataset.count;
        data.wordCount = val === 'infinite' ? 'infinite' : parseInt(val);
        localStorage.setItem('mecano_word_count', data.wordCount);
        
        document.querySelectorAll('[data-count]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
        config.generationMode = btn.dataset.mode;
        localStorage.setItem('mecano_generation_mode', config.generationMode);
        
        document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

restartGame();

toggleMobile();

toggleTheme(); 