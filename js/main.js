import { audio, initAudio, playSound } from './audio.js';
import { config } from './config.js';
import { data, i18n, applyTranslations, loadWords } from './data.js';
import { game, initGame, generateWords, renderWords, updateCursor, updateZenCursor, handleZenInput, handleKeydown, finishGame } from './game.js';
import { stats, userStats, currentSort, saveUserStats, renderUserStats, renderGlobalStatsTable } from './stats.js';
import { ui, timerContainer, timerDisplay, gameArea, wordsContainer, statsContainer, wpmEl, accEl, errorsEl, weakKeysEl, restartBtn, soundBtn, suddenDeathBtn, numbersBtn, uppercaseBtn, symbolsBtn, zenBtn, settingsBtn, closeSettingsBtn, statsBtn, closeStatsBtn, resetStatsBtn, globalStatsTableBody, mobileInput, updateTimerDisplay, updateSettingsVisibility, switchView, showZenPopup } from './ui.js';
import { t, startTimer, stopTimer, formatTime} from './utils.js';

if (config.currentTheme === 'dark') document.body.classList.add('dark-mode');

window.addEventListener('wheel', (e) => {
    if (ui.currentView === 'game') return;
    
    ui.paperScrollY -= e.deltaY * 0.5;
    
    if (ui.paperScrollY > 100) ui.paperScrollY = 100;
    
    const activeSheet = document.querySelector('.sheet-content:not(.hidden)');
    if (activeSheet) {
        const contentHeight = activeSheet.offsetHeight;
        const minScroll = -contentHeight + 400; 
        if (ui.paperScrollY < minScroll) ui.paperScrollY = minScroll;
    }

    gameArea.style.transform = `translateY(${ui.paperScrollY}px)`;
});

applyTranslations();
document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === config.currentLanguage);
});

if (zenBtn) {
    zenBtn.classList.toggle('active', !!config.zenModeEnabled);
    zenBtn.dataset.zen = config.zenModeEnabled ? 'true' : 'false';
    zenBtn.addEventListener('click', () => {
        config.zenModeEnabled = !config.zenModeEnabled;
        if (config.zenModeEnabled) {
            config.numbersEnabled = false;
            config.uppercaseEnabled = false;
            config.symbolsEnabled = false;
            config.suddenDeathEnabled = false;
            numbersBtn.classList.remove('active');
            uppercaseBtn.classList.remove('active');
            symbolsBtn.classList.remove('active');
            suddenDeathBtn.classList.remove('active');
        }
        localStorage.setItem('mecano_zen_mode', config.zenModeEnabled);
        zenBtn.classList.toggle('active', !!config.zenModeEnabled);
        zenBtn.dataset.zen = config.zenModeEnabled ? 'true' : 'false';
        zenBtn.setAttribute('aria-pressed', config.zenModeEnabled ? 'true' : 'false');
        if (ui.currentView === 'game') initGame();
        showZenPopup(zenBtn, config.zenModeEnabled);
        zenBtn.blur();
    });
}

if (zenBtn) {
    zenBtn.setAttribute('aria-pressed', config.zenModeEnabled ? 'true' : 'false');
}

loadWords().then(() => {
    initGame();
});

if (audio.soundEnabled) {
    soundBtn.classList.add('active');
    soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
}

window.addEventListener('resize', updateCursor);

settingsBtn.addEventListener('click', () => {
    if (ui.currentView === 'settings') {
        switchView('game');
        return;
    }
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === config.currentLanguage);
    });
    document.querySelectorAll('[data-count]').forEach(btn => {
        const val = btn.dataset.count;
        btn.classList.toggle('active', val == data.wordCount);
    });
    document.querySelectorAll('[data-mode]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === config.generationMode);
    });
    if (zenBtn) zenBtn.classList.toggle('active', !!config.zenModeEnabled);
    
document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === config.currentTheme);
});
    switchView('settings');
});

closeSettingsBtn.addEventListener('click', () => {
    switchView('game');
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

numbersBtn.addEventListener('click', () => {
    config.numbersEnabled = !config.numbersEnabled;
    numbersBtn.classList.toggle('active');
    if (config.numbersEnabled && config.zenModeEnabled) {
        config.zenModeEnabled = false;
        if (zenBtn) {
            zenBtn.classList.remove('active');
            zenBtn.dataset.zen = 'false';
            zenBtn.setAttribute('aria-pressed', 'false');
            localStorage.setItem('mecano_zen_mode', false);
        }
    }
    if (ui.currentView === 'game') initGame();
    numbersBtn.blur();
});

uppercaseBtn.addEventListener('click', () => {
    config.uppercaseEnabled = !config.uppercaseEnabled;
    uppercaseBtn.classList.toggle('active');
    // If enabling uppercase, disable zen mode
    if (config.uppercaseEnabled && config.zenModeEnabled) {
        config.zenModeEnabled = false;
        if (zenBtn) {
            zenBtn.classList.remove('active');
            zenBtn.dataset.zen = 'false';
            zenBtn.setAttribute('aria-pressed', 'false');
            localStorage.setItem('mecano_zen_mode', false);
        }
    }
    if (ui.currentView === 'game') initGame();
    uppercaseBtn.blur();
});

symbolsBtn.addEventListener('click', () => {
    config.symbolsEnabled = !config.symbolsEnabled;
    symbolsBtn.classList.toggle('active');
    if (config.symbolsEnabled && config.zenModeEnabled) {
        config.zenModeEnabled = false;
        if (zenBtn) {
            zenBtn.classList.remove('active');
            zenBtn.dataset.zen = 'false';
            zenBtn.setAttribute('aria-pressed', 'false');
            localStorage.setItem('mecano_zen_mode', false);
        }
    }
    if (ui.currentView === 'game') initGame();
    symbolsBtn.blur();
});

soundBtn.addEventListener('click', () => {
    audio.soundEnabled = !audio.soundEnabled;
    soundBtn.classList.toggle('active');
    soundBtn.innerHTML = audio.soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    if (audio.soundEnabled) initAudio();
});

suddenDeathBtn.addEventListener('click', () => {
    config.suddenDeathEnabled = !config.suddenDeathEnabled;
    suddenDeathBtn.classList.toggle('active');
    if (config.suddenDeathEnabled && config.zenModeEnabled) {
        config.zenModeEnabled = false;
        if (zenBtn) {
            zenBtn.classList.remove('active');
            zenBtn.dataset.zen = 'false';
            zenBtn.setAttribute('aria-pressed', 'false');
            localStorage.setItem('mecano_zen_mode', false);
        }
    }
    if (ui.currentView === 'game') initGame();
});

statsBtn.addEventListener('click', () => {
    if (ui.currentView === 'stats') {
        switchView('game');
    } else {
        switchView('stats');
    }
});

closeStatsBtn.addEventListener('click', () => {
    switchView('game');
});

resetStatsBtn.addEventListener('click', () => {
    if (confirm(t("alerts.resetHistory"))) {
        stats.charStats = {};
        localStorage.removeItem('mecano_char_stats');
        renderGlobalStatsTable();
        weakKeysEl.textContent = "-";
    }
});

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

restartBtn.addEventListener('click', initGame);
restartBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        initGame();
    }
});

if (mobileInput) {
    window.addEventListener('touchstart', (e) => {
        if (!e.target.closest('button') && !e.target.closest('.modal')) {
            mobileInput.focus();
        }
    }, { passive: true });

    window.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('.modal') && window.innerWidth <= 1024) {
            mobileInput.focus();
        }
    });

    mobileInput.addEventListener('input', (e) => {
        
        if (e.inputType === 'deleteContentBackward') {
            handleKeydown({ key: 'Backspace', preventDefault: () => {} });
        } else if (e.inputType === 'insertLineBreak' || (e.data && e.data.includes('\n'))) {
             handleKeydown({ key: 'Enter', preventDefault: () => {} });
        } else if (e.data) {
            const char = e.data;
            if (char === ' ') {
                 handleKeydown({ key: ' ', preventDefault: () => {} });
            } else {
                 for (const c of char) {
                     handleKeydown({ key: c, preventDefault: () => {} });
                 }
            }
        }
        mobileInput.value = '';
    });
    
    mobileInput.addEventListener('keydown', (e) => {
        e.stopPropagation();
    });
}

// Theme Toggle Logic
document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
        config.currentTheme = btn.dataset.theme;
        localStorage.setItem('mecano_theme', config.currentTheme);
        
        if (config.currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Update UI buttons
        document.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        playSound('click');
    });
});


document.querySelectorAll('[data-game-mode]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.gameMode === config.gameMode);

    btn.addEventListener('click', () => {
        config.gameMode = btn.dataset.gameMode;
        localStorage.setItem('mecano_game_mode', config.gameMode);

        document.querySelectorAll('[data-game-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        updateSettingsVisibility();
    });
});

document.querySelectorAll('[data-time]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.time) === config.timeLimit);

    btn.addEventListener('click', () => {
        config.timeLimit = parseInt(btn.dataset.time);
        localStorage.setItem('mecano_time_limit', config.timeLimit);

        document.querySelectorAll('[data-time]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

updateSettingsVisibility();

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        document.getElementById('stats-profile').classList.toggle('hidden', tab !== 'profile');
        document.getElementById('stats-keys').classList.toggle('hidden', tab !== 'keys');
    });
});