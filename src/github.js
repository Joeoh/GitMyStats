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
     * Convert the response from `contributors` to an array of [String, Number],
     * where String is a username and Number is the amount of contributions of
     * of given type by that user.
     *
     * Args:
     *   contributions: [Object], a subset of the response received from GitHub
     *   type: String, "a", "d", or "c" for additions, deletions or combined.
     *
     * Return:
     *   See main description.
     */
    contributionsPerUser: function(contributions, type) {
        // calulate sum of contributions per week
        var sums = {} // {username: total}
        // for each user
        for (var i = 0; i < contributions.length; i++) {
            var username = contributions[i].author.login
            if (!(username in sums))
                sums[username] = 0
            var weeks = contributions[i].weeks
            // for each week
            for (var j = 0; j < weeks.length; j++)
                sums[username] += weeks[j][type]
        }
        // // convert from {username: total} to [username, total]
        return Object.keys(sums).map(function (username) {
            return [username, sums[username]]
        })
    },
    /*
     * Convert the response from `contributors` to an array of [Date, Number],
     * where Date represents the week and Number is the amount of contributions
     * of given type for that week.
     *
     * Args:
     *   contributions: [Object], a subset of the response received from GitHub
     *   type: String, "a", "d", or "c" for additions, deletions or combined.
     *
     * Return:
     *   See main description.
     */
    contributionsPerWeek: function(contributions, type) {
        // calulate sum of contributions per user
        var sums = {} // {week: total}
        // for each user
        for (var i = 0; i < contributions.length; i++) {
            var weeks = contributions[i].weeks
            // for each week
            for (var j = 0; j < weeks.length; j++) {
                var timestamp = weeks[j].w
                var amount = weeks[j][type]
                if (timestamp in sums)
                    sums[timestamp] += amount
                else
                    sums[timestamp] = amount
            }
        }
        // convert from {week: total} to [Date, total]
        return Object.keys(sums).map(function (timestamp) {
            return [new Date(timestamp * 1000), sums[timestamp]]
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
     *   onsuccess: Function, callback to call on success.
     *   onfail: Function, callback to call on failure.
     *
     * Return:
     *   [[Date, Number]], an array of contributions per week.
     */
    contributors: function (owner, repo, start_week, end_week, user, onsuccess, onfail) {
        var self = this
        $.get("https://api.github.com/repos/" + owner + "/" + repo + "/stats/contributors", function (response) {
            // filter out collaborators
            if (user !== null)
                response = response.filter(function(collaborator) {
                    return collaborator.author.login.localeCompare(user) === 0
                })
            // filter out weeks
            for (var i = 0; i < response.length; i++)
                response[i].weeks = response[i].weeks.filter(function(week) {
                    return start_week <= week.w && week.w <= end_week
                })
            onsuccess(response)
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
        // for each key
        for (var i = 0; i < params.length; i++) {
            const key = params[i][0]
            const values = params[i][1]
            // append "&key=""
            result += "&" + key + "="
            // append "value0, value1, value2" ...
            for (var j = 0; j < values.length; j++) {
                if (j != 0)
                    result += ","
                result += values[j]
            }
        }
        return result
    }
}

// Make available to `node` for unittesting.
module.exports = github
