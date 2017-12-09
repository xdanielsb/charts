'use strict'
/**
 * @file Base chart
 * @author Daniel Santos <dfsantosbu@unal.edu.co>
 * @version 0.1
 */

let nameFile = "../../data/b3_2.csv"
/*
  @Constants: Setup variables
*/
let height = 500
let width = height
let Maxradius = 15
let len = 0
let x0 = 50
let y0 = 30
let maxValue = 1100
let margin = {
  top: 30,
  right: 10,
  bottom: 10,
  left: 30
};

/*
  @Constants for legends
*/
let legendRectSize = 18
let legendSpacing = 4
let color = d3.scaleOrdinal(d3.schemeCategory20b);
let customColors = [
  "blue",
  "red"
]
let labelsLegends = [{
    label: 'Your household'
  },
  {
    label: 'Other household'
  }
];

let elements = []

//Axis
var xscale = d3.scaleLinear()
  .domain([-maxValue, maxValue])
  .range([0, width]); //actual length of axis

var yscale = d3.scaleLinear()
  .domain([-maxValue, maxValue])
  .range([height, 0]) //actual length of axis

var rscale = d3.scaleLinear()
  .domain([0, 2500])
  .range([0, height]);

function getColor(d, i) {
  if (i == 10) return customColors[0]
  return customColors[1]
}
function getX(d, e) {
  return xscale(elements[e][2]);
}
function getY(d, e) {
  return yscale(elements[e][1]);
}
function getRadius(r) {
  return r / 1.2
}

//Read the csv file
d3.csv(nameFile, function (data) {
  // Add elements
  for (let e in data) {
    let info = data[e]
    name = info["name"]
    let r = parseInt(info["radius"])
    let y = parseInt(info["y"])
    let x = parseInt(info["x"])
    if (r) {
      elements.push([r, y, x, name])
    }
  }
  len = elements.length

  let circles = []
  //Create the circles to plot
  for (let i = 1; i < 4; i++) {
    circles.push(400 * i)
  }
  console.log(circles)

  const arrayColumn = (arr, n) => arr.map(x => x[n]);

  let iradios = arrayColumn(elements, 0)
  let iconsum = arrayColumn(elements, 2)

  let ibody = d3.select("#chart")
  let isvg = ibody.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right)
    .attr("transform", "translate(" + (margin.left + 350) + "," + margin.top + ")")
  //                    .style("border", "1px solid black")

  var x_axis = d3.axisBottom()
    .scale(xscale)
    .ticks(0)

  var y_axis = d3.axisLeft()
    .scale(yscale)
    .ticks(7)

  // append a circle
  isvg.selectAll("circle")
    .data(circles)
    .enter()
    .append("circle")
    .attr("cx", xscale(0))
    .attr("cy", yscale(0))
    .attr("r", function (d) {
      return rscale(d);
    })
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("fill", "rgba(0, 0, 0, 0.14)");

  let icircles = isvg.selectAll("circle")
    .data(iradios)
    .enter()
    .append("circle")

  isvg.append("g")
    .attr("transform", "translate(" + (width / 2) + ", " + 0 + ")")
    .call(y_axis)

  isvg.append("g")
    .attr("transform", "translate(" + 0 + ", " + (width / 2) + ")")
    .call(x_axis)
    .style("stroke-width", "0")

  //  now add titles and labels to the axes
  isvg.append("text")
    .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate(" + (width / 2 - 50) + "," + 10 + ")") // text is drawn off the screen top left, move down and out and rotate
    .text("kWh / Month");

  let iattr = icircles
    .attr("cx", getX)
    .attr("cy", getY)
    .attr("r", getRadius)
    .style("fill", getColor)

  let legend = isvg.selectAll('.legend')
    .data(labelsLegends)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      let h = legendRectSize + legendSpacing;
      let offset = h * color.domain().length / 2;
      let horz = width - 130
      let vert = height - (i * 30)
      return 'translate(' + (horz) + ',' + vert + ')';
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function (d, i) {
      return customColors[i];
    })
    .style('stroke', "black");

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d) {
      return d.label;
    });
}) //end d3
