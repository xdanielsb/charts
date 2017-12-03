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
let height = 450, width = 450
let Maxradius = 15,  len = 0
let x0 = 50, y0 = 30;
let maxValue = 1100
let margin = {
  top: 30,
  right: 10,
  bottom: 10,
  left:30
};

let elements = []

var color = d3.schemeCategory20c

function getColor(d,i){
  return color[color.length-i-1]
}
function getColor2(d,i){
  return color[i%(color.length)]
}

//Read the csv file
d3.csv(nameFile, function(data) {
  // Add elements
  for ( let e in data ){
    let info = data[e]
    name = info["name"]
    let r = parseInt(info["radius"])
    let y = parseInt(info["y"])
    let x = parseInt(info["x"])
    if(r){
      elements.push([r , y , x , name])
    }
  }
  len = elements.length

  let circles = []
  //Create the circles to plot
  for( let i = 1; i <4; i++){
    circles.push(400*i)
  }
  console.log(circles)

  const arrayColumn = (arr, n) => arr.map(x => x[n]);

  let iradios = arrayColumn(elements, 0)
  let iconsum = arrayColumn(elements, 2)

  let ibody = d3.select("body")
  let isvg = ibody.append("svg")
                      .attr("width", width +margin.left + margin.right  )
                      .attr("height", height + margin.left + margin.right)
                      .attr("transform", "translate(" + (margin.left +350 )+ "," + margin.top + ")")
  //                    .style("border", "1px solid black")

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

  var x_axis = d3.axisBottom()
                 .scale(xscale)

  var y_axis = d3.axisLeft()
                 .scale(yscale)

  // append a circle
   isvg.selectAll("circle")
     .data(circles)
     .enter()
     .append("circle")
     .attr("cx", xscale(0))
     .attr("cy", yscale(0))
     .attr("r", function(d) {
       return rscale(d);
     })
     .style("stroke", "black")
     .style("stroke-width", 1)
     .style("fill", "none");

  let icircles = isvg.selectAll("circle")
                    .data(iradios)
                    .enter()
                    .append("circle")

  isvg.append("g")
     .attr("transform", "translate("+(width/2 )+", "+0+")")
     .call(y_axis);

  isvg.append("g")
          .attr("transform", "translate("+0+", " +(width/2 ) +")")
          .call(x_axis)

  //  now add titles and labels to the axes
  isvg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (width/2 + 100) +","+30+")")  // text is drawn off the screen top left, move down and out and rotate
      .text("kWh / Month");

  //Add atributtes circles
  function getX (d, e){
    //return elements[e][2] + width/2
  return xscale(elements[e][2]);
  }
  function getY (d, e){
    //return elements[e][1] + height/2
   return yscale(elements[e][1]);
  }
  function getRadius( r ){
    return (Maxradius/len) * 20 * (Maxradius/r)
  }
  let iattr = icircles
              .attr("cx", getX )
              .attr("cy", getY )
              .attr("r", getRadius )
              .style("fill", getColor2 )

})//end d3
