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

export default showKeyboardKeyColor;
