'use strict'
/**
 * @file Base chart
 * @author Daniel Santos <dfsantosbu@unal.edu.co>
 * @version 1
 */

/*
 @Constants: Setup variable
*/
let height = 510
let width = height // restriction for being circles
let Maxradius = 15
let len = 0
let x0 = 50
let home = 1
let y0 = 30
let maxValue = 1100
let minX = 0
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

let elements = []
let iradios = []
let radius = 0
let delta = 0

//Axis
let xscale = d3.scaleLinear()
  .domain([-maxValue, maxValue])
  .range([0, width]); //actual length of axis

let yscale = d3.scaleLinear()
  .domain([-maxValue, maxValue])
  .range([height, 0]) //actual length of axis

let rscale = d3.scaleLinear()
  .domain([0, 2500])
  .range([0, height]);

function getX(e, r) {
 return xscale(elements[r]["x"])
}
function getY(e, r) {
 return yscale(elements[r]["y"])
}
function getRadius(r) {
  return rscale(r) *2
}
function getColor(d, i) {
 if (i == home) return customColors[0]
 return customColors[1]
}

/*
  Get basket
*/
function getBask(n){
  let bask = parseFloat(n) / maxValue * 10.0
  return parseInt(bask)
}

/*
  Function to check if two circles collide
*/
function collide(circles, x, y){
  let n = circles.length
  for(let i = 0; i<n ; i++){
    let c = circles[i]
    if( c["x"] == 0 && c["y"]==0 ) continue
    if( Math.pow(c["x"]-x,2) + Math.pow(c["y"]-y,2) < Math.pow(2*radius,2) ) return true
  }
  return false
}

/*
  Function to rotate a point(nx,ny) a grades
*/
function rotate(nx, ny , a){
  let x = nx, y =ny
  let t = a* Math.PI / 180.0
  nx = x * Math.cos(t) - y * Math.sin(t)
  ny = x * Math.sin(t) + y * Math.cos(t)
  return [nx, ny]
}

/*
 Logic to generate the locations
*/
function generate(dataset, baskets){
  let cont = 0, posx =0.0, posy =0.0
  let n = dataset.length
  let t = 0.0
  for( let i=0; i<n ; ++i){
    posy = dataset[i][1]
    posx = 0
    let bask = getBask(dataset[i][1])
    let many =  baskets.get(bask)[1]
    let count = baskets.get(bask)[0]
    let angle = 360 / count

    let aux = rotate(posx, posy, t)
    posx = aux[0], posy = aux[1]
    t += angle
    let times = 0
    while(collide(elements, posx, posy)){
      times += 1
      console.log("wtf")
      t = parseInt(t)%360
      t += angle
      if(times>=100){
        break;
        //needs to  improve it
      }
      aux = rotate(posx,posy, t)
      posx = aux[0], posy = aux[1]
    }
    elements.push({"radius":radius, "x":posx, "y":posy, "name":dataset[i][0]})
    baskets.set(bask,[ count+1,  many+1])
  }
  return elements
}

/*
  Paint the circles
*/

function paint(nameDiv){
  let circles = []
  //Create the circles to plot
  //the faded circles
  for (let i = 1; i < 4; i++) {
    circles.push(400 * i)
  }
  let ibody = d3.select("#chart")
  let isvg = ibody.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right)
    .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
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
}


class Radial {
  constructor(nameFile){
    this.nameFile = nameFile
  }
  plot(nameDiv, myhome,  flag=true){
    // utilitary function
    const arrayColumn = (arr, n) => arr.map(x => x[n])
    home = myhome

    d3.csv(this.nameFile, function (data) {
      if(flag){
        let dataset = []
        let basket = new Map()
        for (let e in data) {
          let info = data[e]
          let name = info["name"]
          let value = parseInt(info["y"])
          if(name){
            dataset.push([name, value])
            let x = getBask(value)
            if(!basket.has(x)){
              basket.set(x, [0,0])
            }else{
              basket.set(x, [basket.get(x)[0]+1,0])
            }
          }
        }
        radius = parseInt(26*23/dataset.length)
        elements = generate(dataset, basket)
      }else{
        for (let e in data) {
          let info = data[e]
          let name = info["name"]
          if (info["y"]) {
            let value = parseInt(info["radius"])
            let y = parseInt(info["y"])
            let x = parseInt(info["x"])
            radius = value
            elements.push({"radius":value, "y":y,"x":x,  "name":name })
          }
        }
      }
      len =  elements.length
      iradios = arrayColumn(elements, "radius")
      paint(nameDiv)
    })
  }
}
