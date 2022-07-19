import './style.scss';
import keyboardKeys from './data/keyboardKeys';
import wordList from './data/wordList';
import allWords from './data/allWords';

const tileGridDisplay = document.querySelector('[data-id="grid"]');
const keyboardDisplay = document.querySelector('[data-id="keyboard"]');

let currentRow = 0;
let currentCol = 0;

const tileGridWidth = 5;
const tileGridHeight = 6;

let isGameOver = false;

// Empty 2d array for storing tile grid letters in memory
// Dimensions (tileGridWidth x tileGridHeight)
const tileGridArray = Array.from(Array(tileGridHeight), () =>
  new Array(tileGridWidth).fill('')
);

function getWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

// Get a word from the wordList
const answer = getWord();
console.log(answer);

function showCorrectLetters() {
  console.log('showing correct letters');
  // const guess = tileGridArray[currentRow];
  // check for letter position in correct position
}

function checkGuess() {
  if (isGameOver) return;
  const guess = tileGridArray[currentRow].join('').toLowerCase();
  console.log(guess);
  // Check if word is valid
  if (!allWords.includes(guess)) {
    console.log('Your guess is not a valid word');
    return;
  }
  showCorrectLetters(guess);
  // Correct answer
  if (guess === answer) {
    console.log('You win game over');
    return;
  }
  // Next guess
  if (currentRow < tileGridWidth) {
    currentRow += 1;
    currentCol = 0;
    return;
  }
  // Out of guesses
  console.log('Game Over');
  isGameOver = true;
}

function handleKeyPress(key) {
  if (isGameOver) return;
  if (key === 'Backspace') {
    if (currentCol <= 0) return;
    currentCol -= 1;
    const currentTile = document.querySelector(
      `[data-id="tile-${currentRow}-${currentCol}"]`
    );
    currentTile.textContent = '';
    tileGridArray[currentRow][currentCol] = ''; // update array
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
  tileGridArray[currentRow][currentCol] = key; // update array
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

function createTileGridDisplay() {
  tileGridArray.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const tileElement = document.createElement('div');
      tileElement.dataset.id = `tile-${rowIndex}-${colIndex}`;
      tileElement.classList.add('tile');
      tileGridDisplay.append(tileElement);
    });
  });
}

function createKeyboardDisplay() {
  keyboardKeys.forEach((key) => {
    const keyElement = document.createElement('button');
    keyElement.type = 'button';
    if (key === '⌫') {
      keyElement.dataset.key = `Backspace`;
    } else {
      keyElement.dataset.key = `${key}`;
    }
    keyElement.classList.add('key-tile');
    keyElement.textContent = key;
    keyElement.addEventListener('click', (e) =>
      handleKeyPress(e.target.dataset.key)
    );
    keyboardDisplay.append(keyElement);
  });
}

function activateKeyInput() {
  document.addEventListener('keyup', processKeyInput);
}

function initializeGame() {
  createTileGridDisplay();
  createKeyboardDisplay();
  activateKeyInput();
}

initializeGame();
