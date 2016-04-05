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
const OPEN = 1;
const CLOSED = -1;
const ALL = 0;

//checks if a unix timestamp is within two others inclusively.
var withinTime = function(start_week, end_week, input_week){
    return ((start_week === null && end_week === null) ||
            (start_week === null && input_week <= end_week ) ||
            (start_week <= input_week && end_week === null) ||
            (start_week <= input_week && input_week <= end_week))
};


var formIssueQueryString = function(state, milestone, label){

    var stateQuery = "state=";                          //form individual queries
    switch (state) {
        case OPEN:
            stateQuery += "open";
            break;
        case CLOSED:
            stateQuery += "closed";
            break;
        case ALL:
            stateQuery = "";
            break;
        default:
            stateQuery = "";
    }

    var milestoneQuery;
    if (milestone === null || milestone <= 0)
        milestoneQuery = "";
    else
        milestoneQuery = "milestone=" + milestone;

    var labelQuery;
    if (label === null)
        labelQuery = "";
    else
        labelQuery = label;

    var queryString = "?" + stateQuery;                //correctly concatenate queries
    if (queryString === "?")
        queryString += milestoneQuery;
    else if (milestoneQuery !== "")
        queryString += "&" + milestoneQuery;
    if (queryString === "?")
        queryString += labelQuery;
    else if (labelQuery !== "")
        queryString += "&" + labelQuery;
    if (queryString === "?")
        queryString = "";

    return queryString;
};

var github = {
    /**
     * GET /repos/:owner/:repo/stats/commit_activity
     * @return {Array} Commits per day of the week for the last year, starting on Sunday.
     */
    commit_activity: function(owner, repo, onsuccess, onfail) {
        $.get("https://api.github.com/repos/" + owner + "/" + repo + "/stats/commit_activity", function(response) {
            var days = [0, 0, 0, 0, 0, 0, 0];
            for (var i in response) {
                for (var day in response[i].days) {
                    days[day] += response[i].days[day];
                }
            }
            onsuccess(days);
        }).fail(function() {
            onfail();
        });
    },
    // GET /repos/:owner/:repo/collaborators
    commits: function(owner, repo, onsuccess, onfail) {
        $.get("https://api.github.com/repos/" + owner + "/" + repo + "/commits", function(response) {
            onsuccess(response);
        }).fail(function() {
            onfail();
        });
    },
    /**
     * GET /repos/:owner/:repo/stats/participation
     * @return {Array} Commits per week for the last year, oldest week first.
     */
    participation: function(owner, repo, onsuccess, onfail) {
        $.get("https://api.github.com/repos/" + owner + "/" + repo + "/stats/participation", function(response) {
            onsuccess(response.all);
        }).fail(function() {
            onfail();
        });
    },
    /**
     * GET /users/:username
     * @return {Object} An object representing a GitHub user, with fields such as email and blog.
     */
    user: function(username, onsuccess, onfail) {
        $.get("https://api.github.com/users/" + username, function(response) {
            onsuccess(response);
        }).fail(function() {
            onfail();
        });
    },
    //
    // start_week, end_week: week numbers given as a Unix timestamp https://en.wikipedia.org/wiki/Unix_time
    // start_week: if null indicated the beginning of time
    // end_week: if null specifies now
    // a valid week is considered to be one which begins before the end_week and after the start_week values
    contributors: function (owner, repo, start_week, end_week, user, onsuccess, onfail) {
        $.get("https://api.github.com/repos/" + owner + "/" + repo + "/stats/contributors", function (response) {
            response = $.grep(response, function (collaborator, index) {                            //http://api.jquery.com/jQuery.grep/ returns array of desired contributors -- if return value is true, element is retained, else it is deleted.
                if (user === null || collaborator.author.login === user) {                          //filter desired contributors
                    response[index].weeks = $.grep(collaborator.weeks, function (week) {            //filter desired weeks from desired contributors
                        return withinTime(start_week, end_week, week.w);
                    });
                }
                else return false;
                return true;
            });
            onsuccess(response);
        }).fail(function() {
            onfail();
        });
    },
    // convert the response from `github.contributions` to [[date, total]]
    contributionsPerWeek: function(contributors, type) {
        var data = {}
        for (var i in contributors) {
            var weeks = contributors[i].weeks
            for (var j in weeks) {
                if (weeks[j].w in data)
                    data[weeks[j].w] = weeks[j][type]
                else
                    data[weeks[j].w] += weeks[j][type]
            }
        }
        var points = []
        for (var timestamp in data)
            points.push([new Date(timestamp * 1000), data[timestamp]])
        return points
    },
    // GET /repos/:owner/:repo/issues
    // state: 1 returns OPEN issues
    // state: -1 returns CLOSED issues
    // state: 0 returns all issues
    // milestone: should be an integer corresponding to the milestone number field (second milestone has 'number' = 2 etc.)
    // milestone: null means milestones are not filtered
    // label: a specific label name will return the issue of that label
    // label: null means labels are not filtered
    issues: function (owner, repo, state, milestone, label, onsuccess, onfail) {
        var queryString = formIssueQueryString(state, milestone, label);
        $.get("https://api.github.com/repos/" + owner + "/" + repo + "/issues" + queryString, function(response) {
            onsuccess(response);
        }).fail(function() {
            onfail();
        });
    },
    punch_card: function (owner, repo, onsuccess, onfail) {
        $.get("https://api.github.com/repos/" + owner + "/" + repo + "/stats/punch_card", function(response) {
            onsuccess(response);
        }).fail(function() {
            onfail();
        });
    }
};

// Make available to `node` for unittesting.
module.exports = github;
