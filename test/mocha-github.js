var jsdom = require("jsdom");
var window = jsdom.jsdom().defaultView;
var $ = require("jquery")(window)
var assert = require("chai").assert

var asyncAsserts = function(done, asserts) {
  try {
    asserts();
    done();
  } catch(e) {
    done(e);
  }
}

describe("example synchronous test", function() {
  it("should do X", function() {
    assert.equal("foo", "foo", "foo == foo");
    assert.strictEqual("foo", "foo", "foo === foo");
    assert.isOk(true, "this will pass");
  });
});

describe("GitHub APIs", function() {
  it("should return a valid user", function(done) {
    $.get("https://api.github.com/users/barischj", function(response) {
      asyncAsserts(done, function() {
        assert.strictEqual(response.email, "barischj@tcd.ie")
      });
    }).fail(function() {
      asyncAsserts(done, function() {
        assert.isOk(false, "this will fail");
      });
    })
  });
});