/*
  Provides an object called `chart` with functions for creating base 64 encoded
  images of charts. You provide a callback for interacting with the image.

  Example usage:

    chart.pie([[8, "Sleep"], [3, "Work"]], function(base64Image) {
      console.log(base64Image)
    })

  The following dependencies must be loaded before this file:
    <script src="Chart.js-2.0.0-beta2/Chart.min.js"></script>
    <script src="../bower_components/tinycolor/tinycolor.js"></script>
*/

const HIDDEN_CANVAS_ID = "chart_js_hidden_id_(^_^)"

var chart = {
  // points: [[date, yValue]]
  line: function(label, points, callback) {
    var data = this._toChartData(points)
    data.datasets[0].label = label
    data.datasets[0].backgroundColor = "#88D3A1"
    this._create("line", data, {}, callback)
  },
  // points: [[value, label]]
  pie: function(points, callback) {
    var data = this._toChartData(points)
    var colors = this._uniqueHexColors(points.length)
    data.datasets[0].backgroundColor = []
    for (var i = 0; i < colors.length; i++)
      data.datasets[0].backgroundColor.push(colors[i])
    this._create("pie", data, {}, callback)
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
  // Create a (hidden) canvas element for Chart.js.
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
  // points: [x, y]
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