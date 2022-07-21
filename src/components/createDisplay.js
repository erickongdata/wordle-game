import keyboardKeys from '../data/keyboardKeys';

const tileGridDisplay = document.querySelector('[data-id="grid-container"]');
const keyboardDisplay = document.querySelector(
  '[data-id="keyboard-container"]'
);

const tileGridWidth = 5;
const tileGridHeight = 6;

// Empty 2d array
// Dimensions (tileGridWidth x tileGridHeight)
const emptyArray = Array.from(Array(tileGridHeight), () =>
  new Array(tileGridWidth).fill('')
);

function createTileGridDisplay() {
  emptyArray.forEach((row, rowIndex) => {
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
    keyElement.dataset.id = 'key-tile';
    keyElement.textContent = key;
    keyboardDisplay.append(keyElement);
  });
}

export {
  tileGridHeight,
  tileGridWidth,
  createKeyboardDisplay,
  createTileGridDisplay,
};
