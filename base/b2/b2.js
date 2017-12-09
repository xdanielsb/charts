

'use strict'
/**
 * @file Base chart
 * @author Daniel Santos <dfsantosbu@unal.edu.co>
 * @version 0.1
 */

let nameFile = "../../data/b2_1.csv"
/*
  @Constants: Setup letiables
*/
let height = 350
let width = height // restriction for being circles
let Maxradius = 15
let len = 0
let lessX = 0;
let x0 = 50
let y0 = 30
let radius = 0
let maxValue = 1100
let minX = width * 100
let margin = {
  top: 20,
  right: 40,
  bottom: 40,
  left: 300
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

/*
  Function to get the radio
*/
let elements = []

let xscale = d3.scaleLinear()
  .domain([0, maxValue])
  .range([0, width]); //actual length of axis

let yscale = d3.scaleLinear()
  .domain([0, maxValue])
  .range([height, 0]) //actual length of axis

function getRadius(r) {
  return xscale(r)
}
function getX(e, r) {
  return xscale(elements[r][2]) + 50
}
function getY(e, r) {
  //  let res = (maxValue - elements[r][1] ) /(maxValue/height) + y0
  return yscale(elements[r][1]) + y0
}
function getColor(d, i) {
  if (i == 10) return customColors[0]
  return customColors[1]
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
    if (x < lessX) lessX = x
    radius = r;
    if (r) {
      minX = Math.min(minX, x)
      elements.push([r, y, x, name])
    }
  }
  minX = minX - 2 * Maxradius
  len = elements.length

  const arrayColumn = (arr, n) => arr.map(x => x[n]);

  let iradios = arrayColumn(elements, 0)

  let ibody = d3.select("#chart")
  let isvg = ibody.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  //                  .style("border", "1px solid black")

  let x_axis = d3.axisBottom()
    .scale(xscale)
    .ticks(0)

  let y_axis = d3.axisLeft()
    .scale(yscale)

  let icircles = isvg.selectAll("circle")
    .data(iradios)
    .enter()
    .append("circle")

  isvg.append("g")
    .attr("transform", "translate(" + x0 + ", " + y0 + ")")
    .call(y_axis);

  isvg.append("g")
    .attr("transform", "translate(" + x0 + ", " + (height + y0) + ")")
    .style("stroke-dasharray", ("10, 10"))
    .call(x_axis)

  //  now add titles and labels to the axes
  isvg.append("text")
    .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate(" + 15 + "," + (height / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
    .text("kWh / Month");

  //Add atributtes circles
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
      let horz = i * 7 * h - offset + width / 4
      let vert = (height + y0 + 30)
      return 'translate(' + horz + ',' + vert + ')';
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
