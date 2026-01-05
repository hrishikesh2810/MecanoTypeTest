import { applyTranslations, loadWords } from './data.js';
import { initGame, updateCursor, restartGame } from './game.js';
import { toggleZenMode, toggleDarkMode, changeAudioIcon, initializeSettingsEventListeners, toggleMobile, initButtons, scrollPaper } from './ui.js';

toggleDarkMode();
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