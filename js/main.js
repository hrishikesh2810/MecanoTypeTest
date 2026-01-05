import { applyTranslations, loadWords } from './data.js';
import { initGame, updateCursor, restartGame } from './game.js';
import { toggleZenMode, toggleDarkMode, updateThemeToggleIcon, changeAudioIcon, initializeSettingsEventListeners, toggleMobile, initButtons, scrollPaper } from './ui.js';

toggleDarkMode();
updateThemeToggleIcon();
scrollPaper();
applyTranslations();
toggleZenMode();

loadWords().then(() => {
    initGame();
});

changeAudioIcon();
window.addEventListener('resize', updateCursor);
initButtons();
restartGame();
toggleMobile();
initializeSettingsEventListeners(); 