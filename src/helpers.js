const helpers = {
    betterType: function(obj){
        return Object.prototype.toString.call(obj).slice(8, -1);
    }
}

Array.prototype.trimEnds = function(f) {
    // find leftmost element to keep
    var i = 0
    while (i < this.length && f(this[i]))
      i++
    // find rightmost element to keep
    var j = this.length - 1
    while (j > i && f(this[j]))
      j--
    // return new array
    return this.slice(i, j + 1)
};