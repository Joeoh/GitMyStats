/*
  <script src="Chart.js-2.0.0-beta2/Chart.min.js"></script>
  <script src="../bower_components/tinycolor/tinycolor.js"></script>
*/

const HIDDEN_DIV_ID = "chart_js_hidden_id"

// Create a (hidden) canvas element for Chart.js.
window.addEventListener("load", function() {
  var canvas = document.createElement("canvas")
  canvas.id = HIDDEN_DIV_ID
  canvas.style.display = "none"
  document.body.appendChild(canvas)
})

// Return `amount` hex color strings evenly distributed by hue and saturation in
// [90, 100) and lightness in [50, 60). 
function uniqueHexColors(amount) {
  var colors = []
  for(i = 0; i < 360; i += 360 / amount) {
    var hsl = {h: i, s: 90 + Math.random() * 10, l: 50 + Math.random() * 10}
    colors.push(tinycolor(hsl).toHexString())
  }
  return colors
}

// Return a template for the data structure required by Chart.js charts.
function chartDataStructure() {
  return {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  }
}
      
var chart = {
  // Create a pie chart with given data then call the given callback with the
  // base 64 image version of the chart as the only parameter.
  pie: function(data, callback) {
    var chartColors = uniqueHexColors(data.length)
    // Push given data into the required data structure.
    var chartData = chartDataStructure()
    for (var i = data.length - 1; i >= 0; i--) {
      chartData.datasets[0].data.push(data[i][0])
      chartData.labels.push(data[i][1])
      chartData.datasets[0].backgroundColor.push(chartColors[i])
    }
    var newPie;
    Chart.defaults.global.animation.onComplete = function() {
      callback(newPie.toBase64Image())
    }
    newPie = new Chart(document.getElementById(HIDDEN_DIV_ID).getContext("2d"), {
      type: "pie",
      data: chartData
    })
  }
}

// Make available to `node` for unittesting.
module.exports = chart;