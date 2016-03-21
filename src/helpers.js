function betterType(obj){
  return Object.prototype.toString.call(obj).slice(8, -1);
}

function trimArrayEnds(array, f) {
  // find leftmost element to keep
  var i = 0
  while (i < array.length && f(array[i]))
    i++
  // find rightmost element to keep
  var j = array.length - 1
  while (j > i && f(array[j]))
    j--
  // return new array
  return array.slice(i, j + 1)
}

module.exports = {
  betterType: betterType,
  trimArrayEnds: trimArrayEnds
}