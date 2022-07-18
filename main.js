import './style.scss';

const tileGridDisplay = document.querySelector('[data-id="grid"]');
const keyboardDisplay = document.querySelector('[data-id="keyboard"]');

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

function createGrid() {
  tileGridArray.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const tileElement = document.createElement('div');
      tileElement.dataset.id = `tile-${rowIndex}-${colIndex}`;
      tileElement.classList.add('tile');
      tileGridDisplay.append(tileElement);
    });
  });
}

function createKeyboard() {
  keyboardKeys.forEach((key) => {
    const keyElement = document.createElement('button');
    if (key === '⌫') {
      keyElement.dataset.id = `key-Backspace`;
    } else {
      keyElement.dataset.id = `key-${key}`;
    }
    keyElement.classList.add('key-tile');
    keyElement.textContent = key;
    keyboardDisplay.append(keyElement);
  });
}

function initializeGame() {
  createGrid();
  createKeyboard();
}

initializeGame();
