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
                assert.isOk(false, "API call failed");
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
                assert.isOk(false, "API call failed");
            });
        });
    });
});

describe("GitHub API /repos/:owner/:repo/stats/commit_activity", function() {
    it("should return commits in the last year by day of the week", function(done) {
        github.commit_activity("joeoh", "gitmystats", function(response) {
            asyncAsserts(done, function() {
                assert.isOk(response.length == 7, "entry for each day of the week");
            });
        }, function() {
            asyncAsserts(done, function() {
                assert.isOk(false, "API call failed");
            });
        });
    });
});

describe("GitHub API /repos/:owner/:repo/stats/participation", function() {
    it("should return commits in the last year by week", function(done) {
        github.participation("joeoh", "gitmystats", function(response) {
            asyncAsserts(done, function() {
                assert.isOk(response.length == 52, "entry for each week of the year");
            });
        }, function() {
            asyncAsserts(done, function() {
                assert.isOk(false, "API call failed");
            });
        });
    });
});