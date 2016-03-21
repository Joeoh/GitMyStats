const assert        = require("chai").assert,
      helpers       = require("../src/helpers.js")
      trimArrayEnds = helpers.trimArrayEnds

describe("trimArray", function() {
    it("should trim an array", function() {
        var a = [0, 1, 0, 1, 9, 9, 7, 6, 7, 6]
        assert.deepEqual([9, 9], trimArrayEnds(a, function(x) {
            return x < 9
        }), "should only leave 9s")
    });
});