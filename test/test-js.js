var jsdom = require("jsdom");
var window = jsdom.jsdom().defaultView;
var $ = require("jQuery")(window)

describe("testing something synchronously", function() {
  it("should do X", function() {
    [1].indexOf(0).should.equal(-1);
    [1].indexOf(2).should.equal(-1);
  });
});

describe("testing something asynchronously", function() {
  it("should do Y", function(done) {
    $.get("https://api.github.com/users/barischj", function(response) {
      response.email.should.equal("barischj@tcd.ie")
      done();
    }).fail(function() {
      true.should.be.false
      done();
    })
  });
});