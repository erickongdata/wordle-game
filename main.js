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

function getWord(words) {
  return words[Math.floor(Math.random() * wordList.length)];
}

// Get a word from the wordList
const answer = getWord(wordList);
console.log(answer);

function showCorrectLetters(guessArray) {
  // keep track of letter count in answer, queen => {q: 1, u: 1, e: 2, n: 1}
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
  // check for letter in correct position only
  guessArray.forEach((letter, index) => {
    const tile = document.querySelector(
      `[data-id="tile-${currentRow}-${index}"]`
    );
    const letterL = letter.toLowerCase();
    if (letterL === answer[index]) {
      tile.classList.add('green'); // change tile color
      letterCount[letterL] -= 1; // deduct from letter count
    }
  });

  // 2nd pass
  // check for letter in any position
  guessArray.forEach((letter, index) => {
    const tile = document.querySelector(
      `[data-id="tile-${currentRow}-${index}"]`
    );
    const letterL = letter.toLowerCase();
    if (letterL in letterCount && letterCount[letterL] > 0) {
      tile.classList.add('amber');
      letterCount[letterL] -= 1;
      return;
    }
    if (!Array.from(tile.classList).includes('green')) {
      tile.classList.add('absent');
    }
  });
}

function checkGuess() {
  if (isGameOver) return;
  const guessArray = tileGridArray[currentRow];
  const guess = guessArray.join('').toLowerCase();
  console.log(guess);
  // Check if word is valid
  // if (!allWords.includes(guess)) {
  //   console.log('Your guess is not a valid word');
  //   return;
  // }
  showCorrectLetters(guessArray);
  // Correct answer
  if (guess === answer) {
    console.log('You win game over');
    isGameOver = true;
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
