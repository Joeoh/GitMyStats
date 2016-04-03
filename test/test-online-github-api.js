var jsdom = require("jsdom");
var window = jsdom.jsdom().defaultView;
global.$ = require("jquery")(window);
var assert = require("chai").assert;
var asyncAsserts = require("./async-helper.js");
var github = require("../src/github.js");

//test github.user
// describe("GitHub API /user/:username", function() {
//     it("should return a valid user", function(done) {
//         github.user("barischj", function(user) {
//             // If github.user returns data then verify that data.
//             asyncAsserts(done, function() {
//                 assert.strictEqual(user.email, "barischj@tcd.ie")
//             });
//         }, function() {
//             // Else if github.user failed ensure the test fails.
//             asyncAsserts(done, function() {
//                 assert.isOk(false, "API call failed");
//             });
//         });
//     });
// });

// //test commits
// describe("GitHub API /repos/:owner/:repo/commits", function() {
//     it("should return all commits", function(done) {
//         github.commits("joeoh", "gitmystats", function(response) {
//             // If github.commits returns data then verify that data.
//             asyncAsserts(done, function() {
//                 assert.isOk(response.length > 0, "at least 1 commit");
//             });
//         }, function() {
//             // Else if github.user failed ensure the test fails.
//             asyncAsserts(done, function() {
//                 assert.isOk(false, "API call failed");
//             });
//         });
//     });
// });

// //test github.commit_activity
// describe("GitHub API /repos/:owner/:repo/stats/commit_activity", function() {
//     it("should return commits in the last year by day of the week", function(done) {
//         github.commit_activity("joeoh", "gitmystats", function(response) {
//             asyncAsserts(done, function() {
//                 assert.isOk(response.length == 7, "entry for each day of the week");
//             });
//         }, function() {
//             asyncAsserts(done, function() {
//                 assert.isOk(false, "API call failed");
//             });
//         });
//     });
// });

// //test github.participation
// describe("GitHub API /repos/:owner/:repo/stats/participation", function() {
//     it("should return commits in the last year by week", function(done) {
//         github.participation("joeoh", "gitmystats", function(response) {
//             asyncAsserts(done, function() {
//                 assert.isOk(response.length == 52, "entry for each week of the year");
//             });
//         }, function() {
//             asyncAsserts(done, function() {
//                 assert.isOk(false, "API call failed");
//             });
//         });
//     });
// });

//test github.contributors
describe("GitHub API /repos/:owner/:repo/stats/contributors", function() {
    it("should return all contributors", function(done) {
        github.contributors("joeoh", "gitmystats", null, null, null, "a", function(response){
            asyncAsserts(done, function(){
                assert.isOk(response.length > 0, "at least one contributor");
            });
        }, function() {
            asyncAsserts(done, function() {
                assert.isOk(false, "API call failed");
            });
        });
    });
});

// //test github.issues
// describe("GitHub API /repos/:owner/:repo/issues", function() {
//     it("should return all issues", function(done) {
//         github.issues("joeoh", "gitmystats", 0, null, null, function(response){
//             asyncAsserts(done, function(){
//                 assert.isOk(response.length > 0, "at least one contributor");
//             });
//         }, function() {
//             asyncAsserts(done, function() {
//                 assert.isOk(false, "API call failed");
//             });
//         });
//     });
// });
// //test github.punch_card
// describe("GitHub API /repos/:owner/:repo/stats/punch_card", function () {
//     it("should return punch_card data for every hour of a week", function (done) {
//         github.punch_card("joeoh", "gitmystats", function (response) {
//             asyncAsserts(done, function () {
//                 assert.isOk(response.length == 168, "an entry for each hour of the week (168 hours)");
//             });
//         }, function () {
//             asyncAsserts(done, function () {
//                 assert.isOk(false, "API call failed");
//             });
//         });
//     });
// });