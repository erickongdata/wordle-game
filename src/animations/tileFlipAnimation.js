function tileFlipAnimation(tile, index, state) {
  const startDelay = (index + 1) * 100;
  const duration = 400;
  setTimeout(() => {
    tile.classList.add('tile-flip');
  }, startDelay); // start time
  setTimeout(() => {
    tile.classList.add(state); // change tile color
  }, startDelay + duration * 0.5);
  setTimeout(() => {
    tile.classList.remove('tile-flip');
  }, startDelay + duration);
}

export default tileFlipAnimation;
