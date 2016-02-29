var jsdom = require("jsdom");
var window = jsdom.jsdom().defaultView;
global.$ = require("jquery")(window);
var assert = require("chai").assert;    
var asyncAsserts = require("./async-helper.js");
var github = require("../src/github.js");

describe("GitHub API /user/:username", function() {
    it("should return a valid user", function(done) {
        github.user("barischj", function(user) {
            // If github.user returns data then verify that data.
            asyncAsserts(done, function() {
                assert.strictEqual(user.email, "barischj@tcd.ie")
            });
        }, function() {
            // Else if github.user failed ensure the test fails.
            asyncAsserts(done, function() {
                assert.isOk(false, "this will fail");
            });
        });
    });
});

describe("GitHub API /repos/:owner/:repo/commits", function() {
    it("should return all commits", function(done) {
        github.commits("joeoh", "gitmystats", function(response) {
            // If github.commits returns data then verify that data.
            asyncAsserts(done, function() {
                assert.isOk(response.length > 0, "at least 1 commit");
            });
        }, function() {
            // Else if github.user failed ensure the test fails.
            asyncAsserts(done, function() {
                assert.isOk(false, "this will fail");
            });
        });
    });
});