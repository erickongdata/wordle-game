import './style.scss';

const tileGridDisplay = document.querySelector('[data-id="grid"]');
const keyboardDisplay = document.querySelector('[data-id="keyboard"]');

const currentRow = 0;
let currentCol = 0;

const tileGridWidth = 5;
const tileGridHeight = 6;

// Empty 2d array for storing tile grid letters, dimensions (tileGridWidth x tileGridHeight)
const tileGridArray = Array.from(Array(tileGridHeight), () =>
  new Array(tileGridWidth).fill('')
);

// Keyboard keys
const keyboardKeys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  '⌫',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'Enter',
];

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

function checkWord() {
  console.log('Checking word...');
}

function handleKeyPress(key) {
  if (key === 'Backspace') {
    if (currentCol <= 0) return;
    currentCol -= 1;
    const currentTile = document.querySelector(
      `[data-id="tile-${currentRow}-${currentCol}"]`
    );
    currentTile.textContent = '';
    return;
  }
  if (key === 'Enter') {
    if (currentCol < 5) return;
    checkWord();
    return;
  }
  if (currentCol > 4) return;
  const currentTile = document.querySelector(
    `[data-id="tile-${currentRow}-${currentCol}"]`
  );
  currentTile.textContent = key;
  currentCol += 1;
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

function initializeGame() {
  createTileGridDisplay();
  createKeyboardDisplay();
  activateKeyInput();
}

initializeGame();
