'use strict'
/**
 * @file Base chart
 * @author Daniel Santos <dfsantosbu@unal.edu.co>
 * @version 1
 */

/*
 @Constants: Setup variable
*/
let height = 450
let width = height // restriction for being circles
let Maxradius = 15//19.5
let len = 0
let x0 = 65
let y0 = 20
let home = 1
let maxValue = 1500
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
  "#A6A6A6",
  "#595959"
]
let labelsLegends = [{
   label: 'Your household'
 },
 {
   label: 'Other households'
 }
];

let elements = []
let iradios = []
let radius = 65
let delta = 0

let xscale = d3.scaleLinear()
 .domain([0, maxValue])
 .range([0, width]); //actual length of axis

let yscale = d3.scaleLinear()
 .domain([0, maxValue])
 .range([height, 0]) //actual length of axis

function getRadius(r) {
 let res = 19.5 // xscale(r)
 return res
}
function getX(e, r) {
  //console.log(elements[r]["x"], elements[r]["x"])
 return xscale(elements[r]["x"]) -xscale(minX) +x0+radius
}
function getY(e, r) {
 //  let res = (maxValue - elements[r][1] ) /(maxValue/height) + y0
 return yscale(elements[r]["y"]) + y0
}
function getColor(d, i) {
  console.log()
 if (elements[i]["name"] == "House"+home) return customColors[0]
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
 Logic to generate the locations
*/
function generate(dataset, baskets){
  let cont = 0, posx =0, posy =0
  let n = dataset.length
  for( let i=0; i<n ; ++i){
    let bask = getBask(dataset[i][1])
    posy = dataset[i][1]
    let many =  baskets.get(bask)[1]
    let count = baskets.get(bask)[0]
  //  console.log(radius)
    if( many == 0 ){
      posx = width/2
    }else if( many % 2 != 0  ){
      posx =  width / 2  + 2*radius*(many/2)
    }else{
      posx =  width / 2  - 2*radius*(many/2)
    }
    while(collide(elements, posx, posy)){
      console.log("mgd")
      if( many % 2 != 0  ){
        posx += 5
      }else{
        posx -= 5
      }
    }
    if(posx < 0){
      minX = Math.min(minX, posx)
    }

    elements.push({"radius":radius, "x":posx, "y":posy, "name":dataset[i][0]})
    baskets.set(bask,[ count,  many+1])
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
    .attr("transform", "translate(" + (margin.left+35) + "," + margin.top + ")")
  //                  .style("border", "1px solid black")

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
      let horz = i * 7 * h - offset + width / 4 +40*i+15
      let vert = (height + y0 + 50)
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


/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array
}


class BlackHole {
  constructor(nameFile){
    this.nameFile = nameFile
  }
  plot(nameDiv, myhome, flag=true){
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
      //  radius = 62//Math.min(yscale(15), parseInt(26*60/dataset.length))
        dataset = shuffleArray(dataset)
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
            if(x < 0){
              minX = Math.min(minX, x)
            }
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
