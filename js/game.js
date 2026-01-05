import { config } from './config.js';

export const game = {
    timeLeft: config.timeLimit,
    currentWords: [],
    currentWordIndex: 0,
    currentLetterIndex: 0,
    isGameActive: false,
    isGameFinished: false,
    startTime: 0,
    correctChars: 0,
    totalChars: 0,
    errorCount: 0,
    zenBaseTop: 0,
};