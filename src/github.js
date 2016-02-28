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
    $.get(url, function (response) {
    onsuccess(response);
  }).fail(function() {
    onfail();
  });
};

//checks if a unix timestamp is within two others inclusively.
var withinTime = function(start_week, end_week, input_week){
    var isValid = false;
    if((start_week === null && end_week === null) || (start_week === null && input_week <= end_week ) || (start_week <= input_week && end_week === null) || (start_week <= input_week && input_week <= end_week)){
        isValid = true;
    }
    return isValid;
};

var github = {
    // GET /users/:username
    user: function(username, onsuccess, onfail) {
        get("https://api.github.com/users/" + username, onsuccess, onfail);
    },
    // GET /repos/:owner/:repo/collaborators
    commits: function(owner, repo, onsuccess, onfail) {
        get("https://api.github.com/repos/" + owner + "/" + repo + "/commits", onsuccess, onfail);
    },
    // GET /repos/:owner/:repo/stats/contributors
    // start_week, end_week: week numbers given as a Unix timestamp https://en.wikipedia.org/wiki/Unix_time
    // start_week: if null indicated the beginning of time
    // end_week: if null specifies now
    //a valid week is considered to be one which begins before the end_week and after the start_week values
    contributors: function (owner, repo, start_week, end_week, user, onsuccess, onfail) {
        get("https://api.github.com/repos/" + owner + "/" + repo + "/stats/contributors", function (response) {

            response = $.grep(response, function (collaborator, index) {                            //http://api.jquery.com/jQuery.grep/ returns array of desired contributors -- if return value is true, element is retained, else it is deleted.
                var validContributor = true;

                if (user === null || collaborator.author.login === user) {                          //filter desired contributors
                    response[index].weeks = $.grep(collaborator.weeks, function (week) {            //filter desired weeks from desired contributors
                        return withinTime(start_week, end_week, week.w);
                    });
                }
                else
                    validContributor = false;

                return validContributor;
            });
            onsuccess(response);
        }, onfail);

    }
};

// Make available to `node` for unittesting.
module.exports = github;
