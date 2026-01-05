export const config = {
    currentLanguage: localStorage.getItem('mecano_language') || 'en',
    generationMode: localStorage.getItem('mecano_generation_mode') || 'random',
    zenModeEnabled: localStorage.getItem('mecano_zen_mode') === 'true',
    currentTheme: localStorage.getItem('mecano_theme') || 'light',
    gameMode: localStorage.getItem('mecano_game_mode') || 'words',
    timeLimit: parseInt(localStorage.getItem('mecano_time_limit')) || 30,
    timerInterval: null,
    suddenDeathEnabled: false,
    numbersEnabled: false,
    uppercaseEnabled: false,
    symbolsEnabled: false,
};