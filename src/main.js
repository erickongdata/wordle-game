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

const messageDisplay = document.querySelector('[data-id="message-container"]');
const message = document.querySelector('[data-id="message"]');
const messageButton = document.querySelector('[data-id="message-btn"]');

let currentRow = 0;
let currentCol = 0;

// Empty 2d array for storing tile grid letters in memory
// Dimensions (tileGridWidth x tileGridHeight)
let tileGridArray = Array.from(Array(tileGridHeight), () =>
  new Array(tileGridWidth).fill('')
);

let wordCheckPending = false;
let isGameOver = false;
const gameMode = 'hard';

// In medium mode, keep track of revealed letters
let revealedLetters = [];

// In hard mode, also keep track of revealed correct letters in array ['g', '', 'e', '', 's']
let revealedCorrectLetters = new Array(tileGridWidth).fill('');

function getWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

// Get a word from the wordList
// let answer = getWord(wordList);
let answer = 'guess';
// console.log(answer);

function showKeyboardKeyColor(key, state) {
  if (state === 'correct') {
    key.classList.remove('present');
    key.classList.add('correct');
    return;
  }
  if (state === 'present') {
    if (key.classList.contains('correct')) return;
    key.classList.add('present');
    return;
  }
  if (state === 'absent') {
    if (key.classList.contains('correct') || key.classList.contains('present'))
      return;
    key.classList.add('absent');
  }
}

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
      tile.classList.add('correct'); // change tile color
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

    if (tile.classList.contains('correct')) return; // skip correct tiles
    if (letterL in letterCount && letterCount[letterL] > 0) {
      tile.classList.add('present');
      showKeyboardKeyColor(key, 'present');
      letterCount[letterL] -= 1;
      // medium mode
      rowHighlightedLetters.push(letterL);
      return;
    }
    tile.classList.add('absent');
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
  messageButton.textContent = '';
  // reset position
  currentCol = 0;
  currentRow = 0;
  // clear tileGridArray
  tileGridArray = tileGridArray.map((row) => row.map(() => ''));
  // clear tileGridDisplay
  const tiles = document.querySelectorAll('[data-id^="tile"]');
  for (let i = 0; i < tiles.length; i += 1) {
    tiles[i].textContent = '';
    tiles[i].classList.remove('absent', 'present', 'correct');
  }
  // clear keyboardDisplay colors
  const keys = document.querySelectorAll('[data-id="key-tile"]');
  for (let i = 0; i < keys.length; i += 1) {
    keys[i].classList.remove('absent', 'present', 'correct');
  }
  // Get new word
  answer = getWord(wordList);
  isGameOver = false;
  // medium mode
  revealedLetters = [];
  revealedCorrectLetters = revealedCorrectLetters.map(() => '');
}

function showModalMessage(msg) {
  if (msg === 'win') {
    messageDisplay.style.display = 'flex';
    message.textContent = 'WINNER!';
    messageButton.style.display = 'block';
    messageButton.textContent = 'New game';
    messageButton.addEventListener('click', startNewGame);
    return;
  }
  if (msg === 'invalid') {
    messageDisplay.style.display = 'flex';
    message.textContent = 'Invalid word!';
    setTimeout(() => {
      message.textContent = '';
      messageDisplay.style.display = 'none';
    }, 3000);
    return;
  }
  if (msg === 'lose') {
    messageDisplay.style.display = 'flex';
    message.textContent = `FAILED! It was "${answer.toUpperCase()}"`;
    messageButton.style.display = 'block';
    messageButton.textContent = 'New game';
    messageButton.addEventListener('click', startNewGame);
  }
  if (msg === 'word-check') {
    messageDisplay.style.display = 'flex';
    message.textContent = 'Checking word...';
  }
  if (msg === 'medium') {
    messageDisplay.style.display = 'flex';
    message.textContent = 'Use ALL revealed letters!';
    setTimeout(() => {
      message.textContent = '';
      messageDisplay.style.display = 'none';
    }, 3000);
    return;
  }
  if (msg === 'hard') {
    messageDisplay.style.display = 'flex';
    message.textContent = 'Use ALL revealed letters in their correct position!';
    setTimeout(() => {
      message.textContent = '';
      messageDisplay.style.display = 'none';
    }, 3000);
    return;
  }
  if (msg === 'clear') {
    messageDisplay.style.display = 'none';
    message.textContent = '';
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
    showModalMessage('win');
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
  // Check guess is valid word
  // Use online dictionary API to validate word
  // --------------------------------
  wordCheckPending = true;
  showModalMessage('word-check');
  const result = await validateWord(guess).catch((err) => console.log(err));
  showModalMessage('clear');
  wordCheckPending = false;
  if (result === undefined) {
    showModalMessage('invalid');
    return;
  }
  // --------------------------------
  showCorrectTiles(guessArray);
  // Next guess
  if (currentRow < tileGridWidth) {
    currentRow += 1;
    currentCol = 0;
    return;
  }
  // Out of guesses
  showModalMessage('lose');
  isGameOver = true;
}

function handleKeyPress(key) {
  if (isGameOver || wordCheckPending) return;
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

function initializeGame() {
  createTileGridDisplay();
  createKeyboardDisplay();
  activateKeyInput();
  activateKeyboardDisplay();
}

initializeGame();
