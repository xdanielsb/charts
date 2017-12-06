'use strict'
/**
 * @file Base chart
 * @author Daniel Santos <dfsantosbu@unal.edu.co>
 * @version 0.1
 */

let nameFile = "../../data/b1_2.csv"
/*
  @Constants: Setup letiables
*/
let height = 400
let width = 1000
let Maxradius = 15
let len = 0
let x0 = 50
let y0 = 30
let maxValue = 1400
let margin = {
  top: 20,
  right: 40,
  bottom: 40,
  left: 40
};

/*
  @Constants for legends
*/
let legendRectSize = 18; // NEW
let legendSpacing = 4;
let color = d3.scaleOrdinal(d3.schemeCategory20b);
let customColors = [
  "blue",
  "red"
]
let dataset = [{ label: 'Your household'},
               {label: 'Other household'}];



let elements = []
/*
  Function to get the radio
*/
function getRadius(r) {
  return (Maxradius / len) * 20 * (Maxradius / r)
}

function getX(e, r) {
  let res = (width / len) * (r + 1) + x0
  return res
}

function getY(e, r) {
  let res = (maxValue - elements[r][1]) / (maxValue / height) + y0
  return res
}


function getColor(d, i) {
  if (i==10) return customColors[0]
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
    if (r) {
      elements.push([r, y, name])
    }
  }
  len = elements.length

  const arrayColumn = (arr, n) => arr.map(x => x[n]);

  let iradios = arrayColumn(elements, 0)
  let iconsum = arrayColumn(elements, 2)


  let ibody = d3.select("#chart")
  let isvg = ibody.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  //                .style("border", "1px solid black")

  //Axis
  let xscale = d3.scaleLinear()
    .domain([0, iradios.length])
    .range([0, width]); //actual length of axis

  let yscale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([height, 0]) //actual length of axis

  let x_axis = d3.axisBottom()
    .scale(xscale)
    .ticks(0)

  let y_axis = d3.axisLeft()
    .scale(yscale)
    .ticks(12)

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



  let legend = isvg.selectAll('.legend') // NEW
    .data(dataset) // NEW
    .enter() // NEW
    .append('g') // NEW
    .attr('class', 'legend') // NEW
    .attr('transform', function (d, i) { // NEW
      let h = legendRectSize + legendSpacing; // NEW
      let offset = h * color.domain().length / 2; // NEW
      let horz = i * 7 * h - offset + width / 2
      let vert = (height + y0 + 20)
      return 'translate(' + horz + ',' + vert + ')'; // NEW
    }); // NEW

  legend.append('rect') // NEW
    .attr('width', legendRectSize) // NEW
    .attr('height', legendRectSize) // NEW
    .style('fill', function (d, i) {
      return customColors[i];
    }) // NEW
    .style('stroke', color); // NEW

  legend.append('text') // NEW
    .attr('x', legendRectSize + legendSpacing) // NEW
    .attr('y', legendRectSize - legendSpacing) // NEW
    .text(function (d) {
      return d.label;
    }); // NEW

}) //end d3
