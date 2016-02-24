/*
  Provides an object called `github` with useful functions for interacting with
  the GitHub API. Each function in `github` maps to one of GitHub's APIs, for
  example `github.user` maps to `/user:username` which can be used to return
  information about a user on GitHub. Each function requires the arguments
  necessary to create a valid url and must also be provided with a callback for
  both success and failure scenarios. The success callback takes the response as
  its first argument.

  Example usage:

    github.user("barischj", function(user) {
      console.log(user.email)
    }, function() {
      console.log("failed")
    });
*/

var get = function(url, onsuccess, onfail) {
  $.get(url, function(response) {
    onsuccess(response);
  }).fail(function() {
    onfail();
  });
};

var github = {
  // GET /users/:username
  user: function(username, onsuccess, onfail) {
    get("https://api.github.com/users/" + username, onsuccess, onfail);
  },
  // GET /repos/:owner/:repo/collaborators
  commits: function(owner, repo, onsuccess, onfail) {
    get("https://api.github.com/repos/" + owner + "/" + repo + "/commits", onsuccess, onfail);
  }
};

// Make available to `node` for unittesting.
module.exports = github;