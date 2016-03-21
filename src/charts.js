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
  weekdayCommits: function(repo, commits, callback) {
    var data = [
      ["Sunday", commits[0]], ["Monday", commits[1]],
      ["Tuesday", commits[2]], ["Wednesday", commits[3]],
      ["Thursday", commits[4]], ["Friday", commits[5]],
      ["Saturday", commits[6]]
    ]
    data = this._toChartData(data)
    data.datasets[0].fill = false
    data.datasets[0].label = "Commits by weekday to: " + repo
    data.datasets[0].backgroundColor = "#88D3A1"
    this._create("line", data, {}, callback)
  },
  /*
   * Generates a base 64 encoded image of a chart. The image is manipulated with
   * a callback.
   *
   * Args:
   *   repo: String, the title of the repository.
   *   weeks: [Number], commits per week with index 0 the most recent week.
   *   type: String, the type of chart to create.
   *   callback: Function, function that takes the image as first argument.
   */
  participation: function(repo, weeks, type, callback) {
    // create an array of [[label, value]]
    var date = new Date()
    date.setDate(date.getDate() - 365)
    var data = []
    for (var i in weeks) {
      data.push([date.getDate() + "/" + (date.getFullYear() + "").substring(2, 4), weeks[i]])
      date.setDate(date.getDate() + 7)
    }
    // create parameters suitable for Chart.js
    var data = this._toChartData(data)
    data.datasets[0].label = "Weekly commits to: " + repo
    data.datasets[0].backgroundColor = "#88D3A1"
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
  // Create a chart and call the callback with the chart as a base 64 image.
  _create: function(type, data, options, callback) {
    var newChart
    Chart.defaults.global.animation.onComplete = function() {
      callback(newChart.toBase64Image())
    }
    var hiddenCanvas = this._hiddenCanvas()
    newChart = new Chart(hiddenCanvas.getContext("2d"), {
      type: type,
      data: data,
      options: options
    })
  },
  // Create and return a (hidden) canvas element for Chart.js.
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