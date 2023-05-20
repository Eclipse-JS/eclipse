/**
 * Allocates an array with specified size
 * @param {number} num Number to allocate of array indexes
 * @returns {array} Array with each element being the current array length at that element
 */
function array_alloc(num) {
  const arr = [];

  for (var i = 1; i < num+1; i++) {
    arr.push(i);
  }

  return arr;
}