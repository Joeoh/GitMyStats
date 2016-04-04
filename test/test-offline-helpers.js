const assert        = require("chai").assert
const helpers       = require("../src/helpers.js")

describe("Array.prototype.trimEnds", function() {
    it("should return a new array with ends removed based on a given condition", function() {
        var a = [0, 1, 0, 1, 10, 1, 9, 7, 6, 7, 6]
        assert.deepEqual([10, 1, 9], a.trimEnds(function(x) {
            return x < 9
        }), "remove ends less than 9")
    });
});
