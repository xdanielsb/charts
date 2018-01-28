'use strict'
/**
 * @file Base chart
 * @author Daniel Santos <dfsantosbu@unal.edu.co>
 * @version 1
 */
const  radius = 20
/*
  @Constants: Setup letiables
*/
let height = 400
let width = 1000
let Maxradius = 15
let len = 0
let x0 = 70
let y0 = 30
let home = 0
let maxValue = 1500
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
  "#A6A6A6",
  "#595959"
]
let labelsLegends = [{ label: 'Your household'},
               {label: 'Other households'}];

//Dataset =)
let elements = []
let iradios = []
/*
  Utalitary functions
*/

//Axis
let xscale = d3.scaleLinear()
.domain([0, iradios.length])
.range([0, width]); //actual length of axis

let yscale = d3.scaleLinear()
.domain([0, maxValue])
.range([height, 0]) //actual length of axis

function getRadius(r) {
  let res = 18.9 //(Maxradius / len) * 42 * (Maxradius / r)
  //console.log(res)
  return res
}
function getX(e, r) {
  let res = (width / len) * (r + 1) + 51
  return res
}
function getY(e, r) {
  let res = (maxValue - elements[r]["y"]) / (maxValue / height) + y0
  return res
}
function getColor(d, i) {
  if (i==home) return customColors[0]
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
    .attr("transform", "translate(" + (margin.left +40)+ "," + margin.top + ")")

  let x_axis = d3.axisBottom()
    .scale(xscale)
    .ticks(0)

  let y_axis = d3.axisLeft()
    .scale(yscale)
    .tickPadding(7)
    .ticks(5)
    .tickValues(d3.range(0, maxValue+100, 300))
    .tickSize(0,0)

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
    .attr("transform", "translate(" + 20 + "," + (height / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
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
      let horz = i * 10 * h - offset + width / 2 -100
      let vert = (height + y0 + 40)
      return 'translate(' + horz + ',' + vert + ')';
    });

  legend.append('circle')
    .attr('r', 10)
    .style('fill', function (d, i) {
      return customColors[i];
    })
    //.style('stroke', "black");

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing )
    .attr('y', legendRectSize - legendSpacing -8)
    .text(function (d) {
      return d.label;
    });
}


class Peak {
  constructor(file){
    this.file = file
  }
  plot(nameDiv, myhome, flag=true){
    home = myhome
    // utilitary function
    const arrayColumn = (arr, n) => arr.map(x => x[n])
    if(flag){
      d3.csv(this.file, function (data) {
        let dataset = []
        for (let e in data) {
          let info = data[e]
          let name = info["name"]
          let value = parseInt(info["y"])
          dataset.push([name, value])
        }
        elements = generate(dataset)
        len = elements.length
        iradios = arrayColumn(elements, "radius")
        paint(nameDiv)
      })
    }else{
      let dataset = []
      let data = this.file
      for (let e in data) {
        let info = data[e]
        let name = info["name"]
        let value = parseInt(info["y"])
        dataset.push([name, value])
      }
      elements = generate(dataset)
      len = elements.length
      iradios = arrayColumn(elements, "radius")
      paint(nameDiv)
    }

  }
}
