// Number of times an element appears in array
function countElement(array, element) {
  return array.reduce((total, arrayElement) => {
    let currTotal = total;
    if (arrayElement !== element) return currTotal;
    currTotal += 1;
    return currTotal;
  }, 0);
}

// Compare two arrays
// Get unique elements in second array and append to first
// [1, 2], [2, 3, 4] => [1, 2, 3, 4]
// [1, 2], [2, 6, 6, 7, 9] => [1, 2, 6, 6, 7, 9]
// [1, 2, 5], [1, 2, 3, 4] => [1, 2, 5, 3, 4]
// [1, 2, 5], [1, 2, 2])) => [1, 2, 2, 5]
// ['A', 'B', 'C'], ['B', 'E'] => ['A', 'B', 'C', 'E']
function getUniqueArrayElements(arr1, arr2) {
  return arr2.reduce(
    (result, element) => {
      if (countElement(result, element) >= countElement(arr2, element))
        return result;
      result.push(element);
      return result;
    },
    [...arr1]
  );
}

// check if arr2 contains all the elements of arr1
// multiples are counted
function checkArrayContainsAllElements(arr1, arr2) {
  return arr1.every(
    (element) => countElement(arr1, element) <= countElement(arr2, element)
  );
}

export { getUniqueArrayElements, checkArrayContainsAllElements };
