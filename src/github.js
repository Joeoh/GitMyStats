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

var github = {
    /**
     * GET /repos/:owner/:repo/stats/commit_activity
     * @return {Array} Commits per day of the week for the last year, starting on Sunday.
     */
    commit_activity: function(owner, repo, onsuccess, onfail) {
        $.get("https://api.github.com/repos/" + owner + "/" + repo + "/stats/commit_activity", function(response) {
            var days = [0, 0, 0, 0, 0, 0, 0]
            for (var i = 0; i < response.length; i++) {
                for (var j = 0; j < 7; j++) {
                    days[j] += response[i].days[j]
                }
            }
            onsuccess(days)
        }).fail(function() {
            onfail()
        })
    },
    /*
     * Return contributions per week for a repoistory.
     *
     * Args:
     *   owner: String, owner of the repository.
     *   repo: String, name of the repository.
     *   start_week: Number, earlist allowed week.
     *   end_week: Number, most recent allowed week.
     *   user: null|String, null to indicate all users else a specific user.
     *   type: String, "a", "d", or "c" for additions, deletions or combined.
     *   onsuccess: Function, callback to call on success.
     *   onfail: Function, callback to call on failure.
     *
     * Return:
     *   [[Date, Number]], an array of contributions per week.
     */
    contributors: function (owner, repo, start_week, end_week, user, type, onsuccess, onfail) {
        var self = this
        $.get("https://api.github.com/repos/" + owner + "/" + repo + "/stats/contributors", function (response) {
            // filter out collaborators
            response = response.filter(function(collaborator) {
                return user === null || collaborator.author.login.localeCompare(user)
            })
            // filter out weeks
            for (var i = 0; i < response.length; i++)
                response[i].weeks = response[i].weeks.filter(function(week) {
                    return self._withinTime(start_week, end_week, week.w)
                })
            // calulate sum of contributions per week
            var sums = {}
            for (var i = 0; i < response.length; i++) {
                var weeks = response[i].weeks
                for (var j = 0; j < weeks.length; j++) {
                    if (weeks[j].w in sums)
                        sums[weeks[j].w] = weeks[j][type]
                    else
                        sums[weeks[j].w] += weeks[j][type]
                }
            }
            // convert from {timestamp: total} to [Date, total]
            var points = Object.keys(sums).map(function (timestamp) {
                return [new Date(timestamp * 1000), sums[timestamp]]
            })
            onsuccess(points)
        }).fail(function() {
            onfail()
        })
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
    /*
     * Return a list of a repository's issues.
     *
     * Args:
     *   owner: String, owner of the repository.
     *   repo: String, name of the repository.
     *   milestone: String, milestone an issue must be part of.
     *   state: String, "open", "closed" or "all"
     *   assignee: String, username of a user an issue must be assigned to
     *   labels: [String], array of labels that issues must be labelles as
     *   sort: String, "created", "upadted" or "comments"
     *   direction: String, "asc" or "desc"
     *   max: Number, maximum amount of isses to return, null for all
     *   onsuccess: Function, callback to call on success.
     *   onfail: Function, callback to call on failure.
     */
    issues: function(owner, repo, milestone, state, assignee, labels, sort,
                     direction, max, onsuccess, onfail) {
        var url = "https://api.github.com/repos/" + owner + "/" + repo + "/issues"
        url = encodeURI(url + this._paramString([
            ["milestone", [milestone]], ["state", [state]],
            ["assignee", [assignee]], ["labels", labels], ["sort", [sort]],
            ["direction", [direction]]
        ]))
        $.get(url, function(response) {
            onsuccess(response.slice(0, Math.min(max, response.length)));
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
    },
    /* Create a URL parameter string.
     *
     * Args:
     *   params: [[key, [values]]
     *
     * Return:
     *   A string in the form "?keyA=valueA0?keyB=valueB0, valueB1"
     */
     _paramString: function(params) {
        // remove empty values
        for (var i = 0; i < params.length; i++)
            params[i][1] = params[i][1].filter(function(x) {
                return x
            })
        // remove parameters with no values
        params = params.filter(function(param) {
            return param[1].length
        })
        var result = "?"
        for (var i = 0; i < params.length; i++) {
            const key = params[i][0]
            const values = params[i][1]
            result += "&" + key + "="
            for (var j = 0; j < values.length; j++) {
                if (j != 0)
                    result += ","
                result += values[j]
            }
        }
        return result
    },
    /*
     * Is a unix timestamp within two others inclusively?
     *
     * Args:
     *   start_week: Number, earlist allowed week.
     *   end_week: Number, most recent allowed week.
     *   input_week: Number, week to check.
     */
    _withinTime: function(start_week, end_week, input_week){
        return ((start_week === null && end_week === null) ||
                (start_week === null && input_week <= end_week ) ||
                (start_week <= input_week && end_week === null) ||
                (start_week <= input_week && input_week <= end_week))
    }
}

// Make available to `node` for unittesting.
module.exports = github
