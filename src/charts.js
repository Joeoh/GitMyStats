/*
  Provides an object called `chart` with functions for creating base 64 encoded
  images of charts. You provide a callback for interacting with the image.

  Example usage:

    chart.pie([[8, "Sleep"], [3, "Work"]], function(base64Image) {
      console.log(base64Image)
    })

  The following dependencies must be loaded first:
    // for time scales in Chart.js
    <script src="../bower_components/moment/moment.js"></script>
    // for converting from HSL colors to hex strings
    <script src="../bower_components/tinycolor/tinycolor.js"></script>
    // for creating charts
    <script src="chartjsbeta2/Chart.min.js"></script>
*/

const HIDDEN_CANVAS_ID = "chart_js_hidden_id_(^_^)"

var chart = {
  // points: [[date, yValue]]
  contributors: function(label, points, type, callback) {
    var data = this._toChartData(points)
    data.datasets[0].label = label
    data.datasets[0].backgroundColor = "#88D3A1"
    var options = {
      scales: {
        xAxes: [{
          type: "time"
        }]
      }
    }
    this._create(type, data, options, callback)
  },
  /*
   * Generate a base 64 encoded image of a chart of commits by day of the week.
   *
   * Args:
   *   repo: String, the title of the repository.
   *   commits: [Number], commits per day of the week starting on Sunday.
   *   type: String, the type of chart to create.
   *   callback: Function, callback that takes the image as first argument.
   */
  weekdayCommits: function(repo, commits, type, callback) {
    var data = [
      ["Sunday", commits[0]], ["Monday", commits[1]],
      ["Tuesday", commits[2]], ["Wednesday", commits[3]],
      ["Thursday", commits[4]], ["Friday", commits[5]],
      ["Saturday", commits[6]]
    ]
    //creates a string of today's date, to display on the graph title.
    var date = new Date()
    var dateDisplay = date.getDate() + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear() + "").substring(2, 4)
    data = this._toChartData(data)
    data.datasets[0].label = "Commits from this year to " + repo + " by day, as of " + dateDisplay + "."
    data.datasets[0].backgroundColor = "#32F351"
    this._create(type, data, {}, callback)
  },
  /*
   * Generate a base 64 encoded image of a chart of commits per week.
   *
   * Args:
   *   repo: String, the title of the repository.
   *   weeks: [Number], commits per week with index 0 the most recent week.
   *   type: String, the type of chart to create.
   *   callback: Function, callback that takes the image as first argument.
   */
  weeklyCommits: function(repo, weeks, type, callback) {
    // create an array of [[label, value]]
    var date = new Date()
    date.setDate(date.getDate() - 358)  //sets default to 51 weeks ago. this allows most recent week to be shown.
    var data = []
    for (var i = 0; i < weeks.length; i++) {
      var dateString = date.getDate() + "/" + (date.getMonth() + 1) + "/" +
                       (date.getFullYear() + "").substring(2, 4)
      data.push([dateString, weeks[i]])
      date.setDate(date.getDate() + 7)    //labels increment weekly.
    }
    //creates a string of today's date, to display on the graph title.
    var date = new Date()
    var dateDisplay = date.getDate() + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear() + "").substring(2, 4)
    // trim blank weeks from array ends
    data = data.trimEnds(function(x) { return !x[1] })      //gets rid of blank weeks at start.
    // create parameters suitable for Chart.js
    var data = this._toChartData(data)    //readies data for chart usage.
    data.datasets[0].label = "Weekly commits to " + repo + " since inception, as of " + dateDisplay + "."
    data.datasets[0].backgroundColor = "#32F351"
    this._create(type, data, {}, callback)  //actually makes image.
  },

   /*
   * Generate a base 64 encoded image of a chart of commits per week.
   *
   * Args:
   *   repo: String, the title of the repository.
   *   weeks: [Number], commits per week with index 0 the most recent week.
   *   type: String, the type of chart to create.
   *   recentWeeks: Integer, specifies how many weeks of commits to display.
   *   callback: Function, callback that takes the image as first argument.
   */
  //a graph that lets the user specify how many weeks back they want to view
  dateRangeCommits: function(repo, weeks, type, recentWeeks, callback) {
    // create an array of [[label, value]]
    var date = new Date()
    date.setDate(date.getDate() - 358)  //sets default to 51 weeks ago. this allows most recent week to be shown.
    var data = []
    for (var i = 0; i < weeks.length; i++) {
      var dateString = date.getDate() + "/" + (date.getMonth() + 1) + "/" +
                       (date.getFullYear() + "").substring(2, 4)
      data.push([dateString, weeks[i]])
      date.setDate(date.getDate() + 7) 
    }

    //creates a string of today's date, to display on the graph title.
    var date = new Date()
    var dateDisplay = date.getDate() + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear() + "").substring(2, 4)
    //create array of correct length (only contains weeks being displayed.)
    var spares = []
    for (var j = weeks.length-(recentWeeks); j < weeks.length; j++){
      spares.push(data[j])
    }

    // create parameters suitable for Chart.js
    var data = this._toChartData(spares)  //make chart from spares, not data.
    data.datasets[0].label = "Weekly commits to " + repo + " as of " + dateDisplay + "."
    data.datasets[0].backgroundColor = "#32F351"
    this._create(type, data, {}, callback)
  },

  // points: [[value, label]]
  pie: function(points, callback) {
    var data = this._toChartData(points)
    var colors = this._uniqueHexColors(points.length)
    data.datasets[0].backgroundColor = []
    for (var i = 0; i < colors.length; i++)
      data.datasets[0].backgroundColor.push(colors[i])
    var options = {
      cutoutPercentage: 50
    }
    this._create("pie", data, options, callback)
  },
  /*
   * Generate a base 64 encoded image of a chart representing a punchcard.
   *
   * Args:
   *   points: Array, the response returned from `github.punch_card`
   *   callback: Function, callback that takes the image as first argument.
   */
  punch_card: function(points, callback) {
    const minPointSize = 1
    const maxPointSize = 40
    // determine max and min size of punchcard points
    var minContributions = 0
    var maxContributions = 0
    for (var i = 0; i < points.length; i++) {
      minContributions = Math.min(minContributions, points[i][2])
      maxContributions = Math.max(maxContributions, points[i][2])
    }
    // set up data object for Chart.js
    var data = {
      // x-axis labels are 12am, 1am, ... 11pm
      labels: [].null(24).map(function(_, i) {
        const value = i % 12 === 0 ? 12 : i % 12
        if (i <= 11) return value + "am"
        else         return value + "pm"
      }),
      // need a dataset for every 24 * 7 possible point
      datasets: [].null(168).map(function() {
        return {
          // each dataset be of length 24 (length of x-axis)
          data: [].null(24).map(function() { return null })
        }
      })
    }
    // insert each point to the dataset unless it's value is 0
    for (var i = 0; i < points.length; i++) {
      const commits = points[i][2]
      if (commits !== 0)
        data.datasets[i].data[points[i][1]] = points[i][0]
      // p is a value in [0 1]
      const p = (commits - minContributions) / (maxContributions - minContributions)
      data.datasets[i].pointBorderWidth = p * (maxPointSize - minPointSize) + minPointSize
      data.datasets[i].fill = false
    }
    var options = {
      legend: { display: false },
      scales: {
        yAxes: [{
          ticks: {
            // set min and max to ensure y-axis has all 7 values
            min: 0,
            max: 6,
            // convert y-axis value to day string
            callback: function(value) {
              return ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"][value]
            }
          }
        }]
      }
    }
    this._create("line", data, options, callback)
  },
  /*
   * Create a base 64 image of a chart.
   *
   * Args:
   *   type: String, the type of chart.
   *   data: Object, the data to pass to Chart.js.
   *   options: Object, the options object to pass to Chart.js
   *   callback: Function, callback that takes the image as first argument.
   */
  _create: function(type, data, options, callback) {
    var newChart
    Chart.defaults.global.animation.onComplete = function() {
      callback(newChart.toBase64Image())
    }
    newChart = new Chart(this._hiddenCanvas().getContext("2d"), {
      type: type,
      data: data,
      options: options
    })
  },
  /*
   * Return a (hidden) canvas element for Chart.js.
   *
   * If the document doesn't contain the element then it is first created with
   * display = "none" and appended to the document.
   */
  _hiddenCanvas: function() {
    if (!document.getElementById(HIDDEN_CANVAS_ID)) {
      var canvas = document.createElement("canvas")
      canvas.id = HIDDEN_CANVAS_ID
      canvas.style.display = "none"
      document.body.appendChild(canvas)
    }
    return document.getElementById(HIDDEN_CANVAS_ID)
  },
  // Return data structured for Chart.js.
  // points: [xLabel, yValue]
  _toChartData: function(points) {
    var data = {
      labels: [],
      datasets: [
        {
          data: []
        }
      ]
    }
    for (var i = 0; i < points.length; i++) {
      data.labels.push(points[i][0])
      data.datasets[0].data.push(points[i][1])
    }
    return data
  },
  // Return `amount` hex color strings evenly distributed by hue with saturation
  // in [90, 100) and lightness in [50, 60).
  _uniqueHexColors: function(amount) {
    var colors = []
    for (var i = 0; i < 360; i += 360 / amount) {
      var hsl = {h: i, s: 90 + Math.random() * 10, l: 50 + Math.random() * 10}
      colors.push(tinycolor(hsl).toHexString())
    }
    return colors
  }
}

// Make available to `node` for unittesting.
module.exports = chart;
