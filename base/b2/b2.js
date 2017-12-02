'use strict'

let height = 500
let width = 500
let Maxradius = 15
let len = 0
let x0 = 50, y0 = 30;
let maxValue = 1100
let minX = width*100;
let margin = {
    top: 20,
    right: 40,
    bottom: 40,
    left:40
  };
/*
  Function to get the radio
*/
let elements = []

function getRadius( r ) {
  return (width * 10 / 1000)
}

function getX( e, r){
  let res = elements[r][2] + x0 - minX;
  return res
}

function getY( e, r){
  let res = (maxValue - elements[r][1] ) /(maxValue/height) + y0
  return res
}

var color = d3.schemeCategory20c

function getColor(d,i){
  return color[i%color.length]
}

//Read the csv file
d3.csv("b21.csv", function(data) {
  // Add elements
  for ( let e in data ){
    let info = data[e]
    name = info["name"]
    let r = parseInt(info["radius"])
    let y = parseInt(info["y"])
    let x = parseInt(info["x"])
    if(r){
      minX = Math.min(minX, x)
      elements.push([r , y , x , name])
    }
  }
  minX =  minX - 2*Maxradius
  len = elements.length

  const arrayColumn = (arr, n) => arr.map(x => x[n]);

  let iradios = arrayColumn(elements, 0)
  let iconsum = arrayColumn(elements, 2)


  let ibody = d3.select("body")
  let isvg = ibody.append("svg")
                      .attr("width", width +margin.left + margin.right  )
                      .attr("height", height + margin.left + margin.right)
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                      .style("border", "1px solid black")

  //Axis
  var xscale = d3.scaleLinear()
                 .domain([0, maxValue])
                 .range([0, width]); //actual length of axis

  var yscale = d3.scaleLinear()
                 .domain([0, maxValue])
                 .range([height, 0]) //actual length of axis


  var x_axis = d3.axisBottom()
                 .scale(xscale)


  var y_axis = d3.axisLeft()
                 .scale(yscale)
                 //.ticks(12)

  let icircles = isvg.selectAll("circle")
                    .data(iradios)
                    .enter()
                    .append("circle")


  isvg.append("g")
     .attr("transform", "translate("+x0+", "+y0+")")
     .call(y_axis);

  isvg.append("g")
          .attr("transform", "translate("+x0+", " +(height+y0) +")")
          .call(x_axis)


  //  now add titles and labels to the axes
  isvg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ 15 +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
      .text("kWh / Month");


  isvg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (width/2) +","+(height+y0+45)+")")  // centre below axis
      .text("Houses");


  //Add atributtes circles
  let iattr = icircles
              .attr("cx", getX )
              .attr("cy", getY )
              .attr("r", getRadius )
              .style("fill", getColor )

})//end d3
