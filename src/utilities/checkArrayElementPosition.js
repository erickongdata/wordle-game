// compare two arrays
// check if arr2 has element in the same position as arr1
// arr1 ['g', 'u', '', 's', ''] arr2 ['g', 'u', 'e', 's', 't']
function checkArrayElementPosition(arr1, arr2) {
  return arr1.every(
    (element, index) => element === '' || element === arr2[index]
  );
}

export default checkArrayElementPosition;
