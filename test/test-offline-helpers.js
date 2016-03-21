const assert        = require("chai").assert
const helpers       = require("../src/helpers.js")

describe("trimArray", function() {
    it("should trim an array", function() {
        var a = [0, 1, 0, 1, 9, 9, 7, 6, 7, 6]
        assert.deepEqual([9, 9], a.trimEnds(function(x) {
            return x < 9
        }), "should only leave 9s")
    });
});