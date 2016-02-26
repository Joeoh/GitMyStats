var assert = require("chai").assert;
var asyncAsserts = require("./mocha-async-helper.js");

describe("example synchronous test", function() {
    it("should all be true", function() {
        // Fail messages go as the 3rd argument.
        assert.equal("foo", "foo", "foo != foo");
        assert.strictEqual("foo", "foo", "foo !== foo");
        assert.isOk(true, " true not Ok");
    });
});

describe("example asynchronous test", function() {
    it("should complete after 10ms", function(done) {
        setTimeout(function() {
            asyncAsserts(done, function() {
                assert.equal(true, true, "true != true");
            });
        }, 10);
    });
});