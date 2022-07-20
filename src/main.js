import './style.scss';
import wordList from './data/wordList';
import {
  tileGridArray,
  tileGridWidth,
  createKeyboardDisplay,
  createTileGridDisplay,
} from './components/createDisplay';
import validateWord from './utilities/validateWord';

const messageDisplay = document.querySelector('[data-id="message-container"]');
const message = document.querySelector('[data-id="message"]');
const messageButton = document.querySelector('[data-id="message-btn"]');

let currentRow = 0;
let currentCol = 0;

let isGameOver = false;

function getWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

// Get a word from the wordList
const answer = getWord(wordList);
// const answer = 'begun';
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
    if (key.classList.contains('correct', 'present')) return;
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
      return;
    }
    tile.classList.add('absent');
    showKeyboardKeyColor(key, 'absent');
  });
}

async function checkGuess() {
  if (isGameOver) return;
  const guessArray = tileGridArray[currentRow];
  const guess = guessArray.join('').toLowerCase();
  // console.log(guess);
  // Correct answer
  if (guess === answer) {
    showCorrectTiles(guessArray);
    message.textContent = 'Correct. You win!';
    isGameOver = true;
    return;
  }
  // Check guess is valid word
  // Use online dictionary API to validate word
  const result = await validateWord(guess).catch((err) => console.log(err));
  if (result === undefined) {
    message.textContent = 'Not a valid word';
    setTimeout(() => {
      message.textContent = '';
    }, 2000);
    return;
  }
  showCorrectTiles(guessArray);
  // Next guess
  if (currentRow < tileGridWidth) {
    currentRow += 1;
    currentCol = 0;
    return;
  }
  // Out of guesses
  message.textContent = 'Game over!';
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
