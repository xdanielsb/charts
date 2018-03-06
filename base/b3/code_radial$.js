'use strict'
/**
 * @file Base chart
 * @author Daniel Santos <dfsantosbu@unal.edu.co>
 * @version 1
 */

/*
 @Constants: Setup variable
*/
let height = 520
let width = height // restriction for being circles
let Maxradius = 15
let len = 0
let x0 = 50
let home = 1
let y0 = 30
let maxValue = 1550
let minX = 0
let margin = {
 top: 20,
 right: 40,
 bottom: 40,
 left: 360
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
 return xscale(elements[r-3]["x"])
}
function getY(e, r) {
 return yscale(elements[r-3]["y"])
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
    let aux = radius*100/30
    if( Math.pow(c["x"]-x,2) + Math.pow(c["y"]-y,2) < Math.pow(2*aux,2) ) return true
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
  elements= []
  let cont = 0, posx =0.0, posy =0.0
  let n = dataset.length
  let t = 0.0
  for( let i=0; i<n ; ++i){
    posy = dataset[i][1]
    posx = 0
    let bask = getBask(dataset[i][1])
    let many =  baskets.get(bask)[1]
    let count = baskets.get(bask)[0]
    let rand = Math.floor((Math.random() * 90) + 0);
    let angle = 90 +rand

    let aux = rotate(posx, posy, t)
    posx = aux[0], posy = aux[1]
    t += angle
    let times = 0
    let ok = true;
    while(collide(elements, posx, posy)){
      times += 1
    //  console.log("wtf")
      t = parseInt(t)%360
      t += angle
      if(times>=(360/angle)){
        times = 1
        angle = angle /2
      }
      aux = rotate(posx,posy, t)
      posx = aux[0], posy = aux[1]
      if(angle < 1) {
  //      console.log("super tired")
      //  ok = false;
        break
      }
    }
    if(ok){
      elements.push({"radius":radius, "x":posx, "y":posy, "name":dataset[i][0]})
      baskets.set(bask,[ count+1,  many+1])
    }
  }
  return elements
}

/*/ 
  ADV: Function to find the interception between a line and a circle.
    A circle is:
  var circle = {
    radius : 500,
    center : point(1000,1000),
  }
    A Line is:
  var line = {
    p1 : point(500,500),
    p2 : point(2000,1000),
  }
    A point is:
  var Point = {
    x : 100,
    y : 100,
  }
  The function returns an array of up to two point on the line segment. If no points found returns an empty array.
/*/
/*function inteceptCircleLineSeg(circle, line){
    var a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
    v1 = {};
    v2 = {};
    v1.x = line.p2.x - line.p1.x;
    v1.y = line.p2.y - line.p1.y;
    v2.x = line.p1.x - circle.center.x;
    v2.y = line.p1.y - circle.center.y;
    b = (v1.x * v2.x + v1.y * v2.y);
    c = 2 * (v1.x * v1.x + v1.y * v1.y);
    b *= -2;
    d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
    if(isNaN(d)){ // no intercept
        console.log(":(")
        return [];
    }
    u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
    u2 = (b + d) / c;    
    retP1 = {};   // return points
    retP2 = {}  
    ret = []; // return array
    if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
        console.log(":D")
        retP1.x = line.p1.x + v1.x * u1;
        retP1.y = line.p1.y + v1.y * u1;
        ret[0] = retP1;
    }
    if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
        console.log(":O")
        retP2.x = line.p1.x + v1.x * u2;
        retP2.y = line.p1.y + v1.y * u2;
        ret[ret.length] = retP2;
    }       
    return ret;
}*/

function sum(la, le ){
  return la + le
}

/*
  Paint the circles
*/

function paint(nameDiv){

  let ibody = d3.select("#chart")
  let isvg = ibody.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right)
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top )+ ")")
    .attr("stroke-width", "0")
  //.style("border", "1px solid black")

  var x_axis = d3.axisBottom()
    .scale(xscale)
    .ticks(0)

  var y_axis = d3.axisLeft()
    .scale(yscale)
    .tickValues([200, 900, 1500])
    .tickFormat(function (d) {
      if(d > 0 ) return d
    })
    .tickPadding(5)

  //ADV: IDs on D3.js can't start with numbers, actually, the best option is not put numbers at all
  let bol = [
      {id: "bigCircle",radio:1190},
      {id: "middleCircle",radio:700},
      {id: "innerCircle",radio:144}
  ]


  // append a circle
  let ic =   isvg.selectAll("circle")
    .data(bol, function(d){
      return d.radio
    })
    .enter()
    .append("circle")
    .attr("cx", xscale(0))
    .attr("cy", yscale(0))
    .attr("r", function (d) {
      return rscale(d.radio);
    })
    .attr("id", function(d){
      return d.id;
    })
    .style("stroke", "black")
    .style("fill",function(d){
      if(d.id == "bigCircle") return "#F2F2F2";
      if(d.id  == "middleCircle") return "#D9D9D9";
      if(d.id  == "innerCircle") return "#F2F2F2";
    });


  iradios.unshift(0)
  iradios.unshift(0)
  iradios.unshift(0)

  let backgroundCircles = []
        backgroundCircles.push( d3.select("#bigCircle"))
        backgroundCircles.push( d3.select("#middleCircle"))
        backgroundCircles.push( d3.select("#innerCircle"))

  isvg.selectAll("circle")
    .data(iradios)
    .enter()
    .append("circle")
    .attr("cx", getX)
    .attr("cy", getY)
    .attr("r", getRadius)
    .attr("opacity", 0) // ADV : All circles must be hidden at the start
    .attr("id", function(d, i){
//      console.log(this)
      return "dot" + i
    })
    .style("fill", getColor)
///////////////////////////////////////////////////////////////////////////////////////////////////////// ADV - start

  // ADV: Getting references to all circles within the graph (I called them dots)
  let dots = isvg.selectAll("circle")
  dots.transition()
    .delay(function(d, i){
      if(i == home){
        return 200; //Showing home dot first
      }else{
        //ADV: Getting the center of all the circles
        let element = backgroundCircles[1].node();
        let bbox = element.getBBox()
        let centerMiddleCircle = [bbox.x + bbox.width/2, bbox.y + bbox.height/2]

        let circleBbox = this.getBBox();
        let centerDot = [circleBbox.x + circleBbox.width/2, circleBbox.y + circleBbox.height/2] //current circle center
        //ADV: Calculating distance
        let distance = Math.sqrt((Math.pow(centerDot[0]-centerMiddleCircle[0],2))+(Math.pow(centerDot[1]-centerMiddleCircle[1],2)))

        if (distance < bbox.width/2){
          //ADV: The dot is within the middle circle, should appear first
          return 700
        }else {
          return 1200
        }
      }
    })
    .duration(800)
    .attr("opacity", 1)

    //moving all the dots 
  dots.transition()
    .delay(1500)
    .duration(1000)
    .attr("transform", function(d, i){
      if(  !(i == 0 || i == 1 || i == 2) ){
        if( elements[i]!=undefined   ){
          let _x =  getX(d, i)  - width / 2;
          let _y =  getY(d, i)  - height /2;
          let _str=""
          console.log(i)
          if( _x >=0 && _y >=0){
            _str =   "translate(10, 10)"
          }else if ( _x <= 0 && _y >=0){
            _str =   "translate(-10, +10)"
          }else if ( _x < 0 && _y <0){
            _str =   "translate(-10, -10)"
          }else if ( _x >=0 && _y <=0){
            _str =   "translate(10, -10)"
          }

          return _str
          }
        }
    })
    .attr("opacity", 1)
    

  
///////////////////////////////////////////////////////////////////////////////////////////////////////// ADV - end
  let arrows = [0,1,2,3,4,5,6,7]
  let arrowsy1 = [22, 22, 117, 117,230, 230, width/2, width/2]
  let iarrows = isvg.selectAll("line")
    .data(arrows)
    .enter()
    .append("line")

  let iattr = iarrows
    .style("stroke", function(d,i){
      if(i%2==0)return "gray"
      return "gray"
    })
    .style("stroke-width", "1")
    .style("stroke", "black")  // colour the line
    .attr("x1", width/2)
    .attr("y1",  function(d,i){
      return arrowsy1[i]
    })
    .attr("x2", function(d,i){
       if (i%2==0) return width/2 -9
       else return width/2 +9
    })
    .attr("y2",  function(d,i){
       return arrowsy1[i] -15
    });

  isvg.append("g")
    .attr("transform", "translate(" + (width / 2) + ", " + 0 + ")")
     .call(y_axis)

  isvg.append("g")
    .attr("transform", "translate(" + 0 + ", " + (width / 2) + ")")
    .call(x_axis)
    .style("stroke-width", "0")

  isvg.append("line")          // attach a line
      .style("stroke", "black")  // colour the line
      .style("stroke-width", "1")
      .attr("x1", width/2)     // x position of the first end of the line
      .attr("y1", 0)      // y position of the first end of the line
      .attr("x2", width/2)     // x position of the second end of the line
      .attr("y2", height/2);    // y position of the second end of the line

  //  now add titles and labels to the axes
  isvg.append("text")
    .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate(" + (width / 2  + 60) + "," + 10 + ")") // text is drawn off the screen top left, move down and out and rotate
    .text("kWh / Month");


  let legend = isvg.selectAll('.legend')
    .data(labelsLegends)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      let h = legendRectSize + legendSpacing;
      let offset = h * color.domain().length / 2;
      let horz = width
      let vert = height/1.2 - (i * 50)
      return 'translate(' + (horz) + ',' + vert + ')';
    });

    legend.append('circle')
      .attr('r', 10)
      .style('fill', function (d, i) {
        return customColors[i];
      })
      .style('stroke', "black");

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing )
      .attr('y', legendRectSize - legendSpacing -8)
      .text(function (d) {
        return d.label;
      });

}

class Radial {
  constructor(file){
    this.file = file
  }
  plot(nameDiv, myhome,  flag=true){
    // utilitary function
    document.getElementById(nameDiv).innerHTML = ""
    const arrayColumn = (arr, n) => arr.map(x => x[n])
    home = myhome
    if (flag) {
      d3.csv(this.file, function (data) {
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
        radius =  29 // Math.min(30, parseInt(26*30/dataset.length))
        elements = generate(dataset, basket)
        len =  elements.length
        iradios = arrayColumn(elements, "radius")
        paint(nameDiv)
      })
    }else{
      let dataset = []
      let basket = new Map()
      let data = this.file
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
      radius =  30 // Math.min(30, parseInt(26*30/dataset.length))
      elements = generate(dataset, basket)
      len =  elements.length
      iradios = arrayColumn(elements, "radius")
      paint(nameDiv)
    }
  }
}
