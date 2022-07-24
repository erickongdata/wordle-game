import './style.scss';
import wordList from './data/wordList';
import {
  tileGridWidth,
  tileGridHeight,
  createKeyboardDisplay,
  createTileGridDisplay,
} from './components/createDisplay';
import validateWord from './utilities/validateWord';
import {
  getUniqueArrayElements,
  checkArrayContainsAllElements,
} from './utilities/getUniqueArrayElements';
import checkArrayElementPosition from './utilities/checkArrayElementPosition';
import tileFlipAnimation from './animations/tileFlipAnimation';
import showKeyboardKeyColor from './animations/showKeyboardKeyColor';

const messageDisplay = document.querySelector('[data-id="message-container"]');
const message = document.querySelector('[data-id="message"]');
const messageWord = document.querySelector('[data-id="message-word"]');
const messageButton = document.querySelector('[data-id="message-btn"]');

const helpModal = document.querySelector('[data-id="help-container"]');
const wordModal = document.querySelector('[data-id="word-container"]');
const wordForm = document.querySelector('[data-id="word-form"]');
const wordInput = document.querySelector('#word-input');

const wordButton = document.querySelector('[data-id="custom-word-btn"]');
const wordCloseButton = document.querySelector('[data-id="word-close-btn"]');
const modeButton = document.querySelector('[data-id="mode-btn"]');
const quitButton = document.querySelector('[data-id="quit-btn"]');
const helpButton = document.querySelector('[data-id="help-btn"]');
const helpCloseButton = document.querySelector('[data-id="help-close-btn"]');

let currentRow = 0;
let currentCol = 0;

// Empty 2d array for storing tile grid letters in memory
// Dimensions (tileGridWidth x tileGridHeight)
let tileGridArray = Array.from(Array(tileGridHeight), () =>
  new Array(tileGridWidth).fill('')
);

let wordCheckPending = false;
let isGameOver = false;
let gameMode = 'easy';
let isGameModeChangeable = true;
let isGameQuittable = false;
let isKeysDisabled = false;
let isWordButtonEnabled = true;

// In medium mode, keep track of revealed letters
let revealedLetters = [];

// In hard mode, also keep track of revealed correct letters in array ['g', '', 'e', '', 's']
let revealedCorrectLetters = new Array(tileGridWidth).fill('');

function getWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

// Get a word from the wordList
let answer = getWord(wordList);
// let answer = 'scree';
// console.log(answer);

function showCorrectTiles(guessArray) {
  // keep track of letter count in answer, e.g. queen => {q: 1, u: 1, e: 2, n: 1}
  const letterCount = [...answer].reduce((result, letter) => {
    const currentResult = { ...result };
    if (letter in result) {
      currentResult[letter] += 1;
      return currentResult;
    }
    currentResult[letter] = 1;
    return currentResult;
  }, {});

  // keep track of letters highlighted in current row for medium mode
  const rowHighlightedLetters = [];

  // 1st pass
  // Compare guessArray ['g', 'u', 'e', 's', 's'] with answer string 'queen'
  // check for letter in correct position only
  guessArray.forEach((letter, index) => {
    const tile = document.querySelector(
      `[data-id="tile-${currentRow}-${index}"]`
    );
    const key = document.querySelector(`[data-key="${letter}"]`);
    const letterL = letter.toLowerCase();

    if (letterL === answer[index]) {
      tile.classList.add('flipped-correct');
      tileFlipAnimation(tile, index, 'correct');
      showKeyboardKeyColor(key, 'correct');
      letterCount[letterL] -= 1; // deduct from letter count
      // medium mode
      rowHighlightedLetters.push(letterL);
      // hard mode
      revealedCorrectLetters[index] = letterL;
    }
  });

  // 2nd pass
  // check for letter in any position
  guessArray.forEach((letter, index) => {
    const tile = document.querySelector(
      `[data-id="tile-${currentRow}-${index}"]`
    );
    const key = document.querySelector(`[data-key="${letter}"]`);
    const letterL = letter.toLowerCase();

    if (tile.classList.contains('flipped-correct')) return; // skip correct tiles
    if (letterL in letterCount && letterCount[letterL] > 0) {
      tileFlipAnimation(tile, index, 'present');
      showKeyboardKeyColor(key, 'present');
      letterCount[letterL] -= 1;
      // medium mode
      rowHighlightedLetters.push(letterL);
      return;
    }
    tileFlipAnimation(tile, index, 'absent');
    showKeyboardKeyColor(key, 'absent');
  });

  // medium mode
  // update revealedLetters
  revealedLetters = getUniqueArrayElements(
    revealedLetters,
    rowHighlightedLetters
  );
}

function startNewGame() {
  messageDisplay.style.display = 'none';
  messageButton.style.display = 'none';
  message.textContent = '';
  messageWord.textContent = '';
  messageButton.textContent = '';
  messageButton.removeEventListener('click', startNewGame);
  // reset position
  currentCol = 0;
  currentRow = 0;
  // clear tileGridArray
  tileGridArray = tileGridArray.map((row) => row.map(() => ''));
  // clear tileGridDisplay
  const tiles = document.querySelectorAll('[data-id^="tile"]');
  for (let i = 0; i < tiles.length; i += 1) {
    tiles[i].textContent = '';
    tiles[i].classList.remove(
      'absent',
      'present',
      'correct',
      'flipped-correct'
    );
  }
  // clear keyboardDisplay colors
  const keys = document.querySelectorAll('[data-id="key-tile"]');
  for (let i = 0; i < keys.length; i += 1) {
    keys[i].classList.remove('absent', 'present', 'correct');
  }
  // Get new word
  answer = getWord(wordList);
  // Reinitialize
  isGameOver = false;
  isGameModeChangeable = true;
  isWordButtonEnabled = true;
  quitButton.style.display = 'none';
  // medium mode
  revealedLetters = [];
  // hard mode
  revealedCorrectLetters = revealedCorrectLetters.map(() => '');
}

function showModalMessage(msg) {
  const hideModal = (delay = 3000) => {
    setTimeout(() => {
      message.textContent = '';
      messageDisplay.style.display = 'none';
    }, delay);
  };
  if (msg === 'clear') {
    message.textContent = '';
    messageDisplay.style.display = 'none';
    return;
  }
  messageDisplay.style.display = 'flex';

  if (msg === 'win') {
    message.textContent = '⭐ WINNER ⭐';
    messageWord.textContent = answer.toUpperCase();
    messageButton.style.display = 'block';
    messageButton.textContent = 'New game';
    messageButton.addEventListener('click', startNewGame);
    return;
  }
  if (msg === 'lose') {
    message.textContent = 'You lost! It was';
    messageWord.textContent = answer.toUpperCase();
    messageButton.style.display = 'block';
    messageButton.textContent = 'New game';
    messageButton.addEventListener('click', startNewGame);
  }
  if (msg === 'medium') {
    message.textContent = 'Use ALL revealed letters!';
    hideModal();
    return;
  }
  if (msg === 'hard') {
    message.textContent = 'Use ALL revealed letters in their correct places!';
    hideModal();
    return;
  }
  if (msg === 'invalid') {
    message.textContent = 'Word not valid';
    hideModal();
    return;
  }
  if (msg === 'timeout') {
    message.textContent = 'Word check not done. Please try again.';
    hideModal();
    return;
  }
  if (msg === 'network') {
    message.textContent = 'Connection error!';
    hideModal();
    return;
  }
  if (msg === 'word-check') {
    message.textContent = 'Checking word...';
  }
}

function handleWordCheckError(error) {
  console.log(error);
  if (error.code === 'ERR_NETWORK') {
    showModalMessage('network');
  }
  if (error.code === 'ECONNABORTED') {
    showModalMessage('timeout');
  }
  if (error.code === 'ERR_BAD_REQUEST') {
    showModalMessage('invalid');
  }
}

async function checkGuess() {
  if (isGameOver) return;
  const guessArray = tileGridArray[currentRow];
  const guessArrayL = guessArray.map((letter) => letter.toLowerCase());
  const guess = guessArrayL.join('');
  // Correct answer
  if (guess === answer) {
    showCorrectTiles(guessArray);
    setTimeout(() => {
      showModalMessage('win');
    }, 1500);
    isGameOver = true;
    return;
  }
  // medium mode letter check
  if (gameMode === 'medium') {
    if (!checkArrayContainsAllElements(revealedLetters, guessArrayL)) {
      showModalMessage('medium');
      return;
    }
  }
  // hard mode letter check
  if (gameMode === 'hard') {
    if (
      !checkArrayElementPosition(revealedCorrectLetters, guessArrayL) ||
      !checkArrayContainsAllElements(revealedLetters, guessArrayL)
    ) {
      showModalMessage('hard');
      return;
    }
  }
  // Use online dictionary API to validate word
  // --------------------------------
  wordCheckPending = true;
  showModalMessage('word-check');
  const result = await validateWord(guess).catch(handleWordCheckError);
  wordCheckPending = false;
  if (result === undefined) {
    return;
  }
  showModalMessage('clear');
  // --------------------------------
  showCorrectTiles(guessArray);
  // Next guess
  if (currentRow < tileGridHeight - 1) {
    currentRow += 1;
    currentCol = 0;
    return;
  }
  // Out of guesses
  setTimeout(() => {
    showModalMessage('lose');
  }, 1500);
  isGameOver = true;
}

function handleKeyPress(key) {
  if (isKeysDisabled) return;
  if (isGameOver) {
    if (key === 'Enter') {
      startNewGame();
    }
    return;
  }
  if (wordCheckPending) return;

  if (key === 'Backspace') {
    if (currentCol <= 0) return;
    currentCol -= 1;
    const currentTile = document.querySelector(
      `[data-id="tile-${currentRow}-${currentCol}"]`
    );
    currentTile.textContent = '';
    tileGridArray[currentRow][currentCol] = ''; // update tileGridArray
    return;
  }
  if (key === 'Enter') {
    if (currentCol < tileGridWidth) return;
    // After first try, gameMode and wordButton is locked and game is quittable
    if (isGameModeChangeable) isGameModeChangeable = false;
    if (!isGameQuittable) isGameQuittable = true;
    if (isWordButtonEnabled) isWordButtonEnabled = false;
    quitButton.style.display = 'initial';
    checkGuess();
    return;
  }
  if (currentCol > tileGridWidth - 1) return;
  const currentTile = document.querySelector(
    `[data-id="tile-${currentRow}-${currentCol}"]`
  );
  currentTile.textContent = key;
  tileGridArray[currentRow][currentCol] = key; // update tileGridArray
  currentCol += 1;
  // animation
  currentTile.classList.add('tile-pop');
  setTimeout(() => {
    currentTile.classList.remove('tile-pop');
  }, 300);
}

function processKeyInput(e) {
  if (e.code === 'Backspace' || e.code === 'Enter') {
    handleKeyPress(e.code);
    return;
  }
  if (e.code >= 'KeyA' && e.code <= 'KeyZ') {
    handleKeyPress(e.code[3]);
  }
}

function activateKeyInput() {
  document.addEventListener('keyup', processKeyInput);
}

function activateKeyboardDisplay() {
  const keys = document.querySelectorAll('[data-id="key-tile"]');
  keys.forEach((key) =>
    key.addEventListener('click', (e) => handleKeyPress(e.target.dataset.key))
  );
}

function changeMode() {
  if (!isGameModeChangeable) return;
  if (gameMode === 'easy') {
    gameMode = 'medium';
    modeButton.innerText = '✭✭';
    return;
  }
  if (gameMode === 'medium') {
    gameMode = 'hard';
    modeButton.innerText = '✭✭✭';
    return;
  }
  if (gameMode === 'hard') {
    gameMode = 'easy';
    modeButton.innerText = '✭';
  }
}

function quitGame() {
  if (!isGameQuittable) return;
  isGameQuittable = false;
  showModalMessage('lose');
  isGameOver = true;
}

function showHelpModal() {
  isKeysDisabled = true;
  helpModal.style.display = 'flex';
}

function hideHelpModal(e) {
  e.stopPropagation();
  const element = e.target.dataset.id;
  if (element === 'help-close-btn' || element === 'help-container') {
    isKeysDisabled = false;
    helpModal.style.display = 'none';
  }
}

function showWordModal() {
  if (!isWordButtonEnabled) return;
  isKeysDisabled = true;
  wordModal.style.display = 'flex';
  setTimeout(() => {
    wordInput.focus();
  }, 200);
}

function hideWordModal(e) {
  e.stopPropagation();
  const element = e.target.dataset.id;
  if (element === 'word-close-btn' || element === 'word-container') {
    isKeysDisabled = false;
    wordModal.style.display = 'none';
  }
}

function activateNavbarButtons() {
  modeButton.addEventListener('click', changeMode);
  quitButton.addEventListener('click', quitGame);
  helpButton.addEventListener('click', showHelpModal);
  wordButton.addEventListener('click', showWordModal);
}

function activateHelpModalButtons() {
  helpCloseButton.addEventListener('click', hideHelpModal);
  helpModal.addEventListener('click', hideHelpModal);
}

async function handleWordModalSubmit(e) {
  e.preventDefault();
  const customWord = wordInput.value.toLowerCase();

  wordCheckPending = true;
  wordModal.style.display = 'none';
  wordInput.value = '';
  showModalMessage('word-check');
  const result = await validateWord(customWord).catch(handleWordCheckError);
  wordCheckPending = false;
  if (result === undefined) {
    isKeysDisabled = false;
    return;
  }
  showModalMessage('clear');

  answer = customWord;
  isKeysDisabled = false;
}

function activateWordModal() {
  wordCloseButton.addEventListener('click', hideWordModal);
  wordModal.addEventListener('click', hideWordModal);
  wordForm.addEventListener('submit', handleWordModalSubmit);
}

function initializeGame() {
  createTileGridDisplay();
  createKeyboardDisplay();
  activateKeyInput();
  activateKeyboardDisplay();
  activateNavbarButtons();
  activateHelpModalButtons();
  activateWordModal();
}

initializeGame();
