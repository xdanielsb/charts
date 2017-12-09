'use strict'
/**
 * @file Base chart
 * @author Daniel Santos <dfsantosbu@unal.edu.co>
 * @version 0.1
 */
const  radius = 15
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
let legendRectSize = 18
let legendSpacing = 4
let color = d3.scaleOrdinal(d3.schemeCategory20b);
let customColors = [
  "blue",
  "red"
]
let labelsLegends = [{ label: 'Your household'},
               {label: 'Other household'}];

//Dataset =)
let elements = []
let iradios = []
/*
  Utalitary functions
*/
function getRadius(r) {
  return (Maxradius / len) * 20 * (Maxradius / r)
}
function getX(e, r) {
  let res = (width / len) * (r + 1) + x0
  return res
}
function getY(e, r) {
  let res = (maxValue - elements[r]["y"]) / (maxValue / height) + y0
  return res
}
function getColor(d, i) {
  if (i==10) return customColors[0]
  return customColors[1]
}
/*
 Logic to generate the locations
*/
function generate(dataset){
  let posx = 0
  let n = dataset.length
  let elements = []
  for ( let i=0; i<n; ++i ){
    if(dataset[i][0])
    elements.push({"radius":radius, "y":dataset[i][1], "name":dataset[i][0] })
  }
  return elements
}

/*
  Paint the circles
*/

function paint(nameDiv){
  let ibody = d3.select("#"+nameDiv)
  let isvg = ibody.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
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
    .text("kWh / Month")
    .attr("class", "tittle")

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
      let horz = i * 7 * h - offset + width / 2
      let vert = (height + y0 + 20)
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
}


class Peak {
  constructor(nameFile){
    this.nameFile = nameFile
  }
  plot(nameDiv, flag=true){
    // utilitary function
    const arrayColumn = (arr, n) => arr.map(x => x[n])

    d3.csv(this.nameFile, function (data) {
      if(flag){
        let dataset = []
        for (let e in data) {
          let info = data[e]
          let name = info["name"]
          let value = parseInt(info["y"])
          dataset.push([name, value])
        }
        elements = generate(dataset)
      }else{
        for (let e in data) {
          let info = data[e]
          let name = info["name"]
          if (info["y"]) {
            let value = parseInt(info["radius"])
            let y = parseInt(info["y"])
            elements.push({"radius":value, "y":y, "name":name })
          }
        }
      }
      len = elements.length
      iradios = arrayColumn(elements, "radius")
      paint(nameDiv)
    })
  }
}
