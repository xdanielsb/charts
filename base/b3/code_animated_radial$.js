'use strict'
/**
 * @file Base chart
 * @author Daniel Santos <dfsantosbu@unal.edu.co>
 * @github xdanielsb
 * @version 2
 */

/*
 @Constants: Setup variable
*/
let height = 450
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
let numBigCircles = 3;
let animate = true

/*
 @Constants for legends
*/
let legendRectSize = 18
let legendSpacing = 4
let color = d3.scaleOrdinal(d3.schemeCategory20b);
let customColors = [
  "#E4EE1C", //home
  "#9EB506", 
]
let labelsLegends = [{
   label: 'Others'
 },
 {
   label: 'You'
 }
];

/*
  Global d3
*/
let isvg = undefined

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
 return xscale(elements[r-numBigCircles ]["x"])
}
function getY(e, r) {
 return yscale(elements[r-numBigCircles ]["y"])
}
function getValue(e,r){
  return yscale(elements[r-numBigCircles ]["real"])
}
function getRadius(r) {

  return rscale(r) *2
}
function getColor(d, i) {
 if (i == home) return customColors[0]
 return  customColors[1]
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
    let rand = 10; //Math.floor((Math.random() * 90) + 0);
    let angle = 90 +rand

    let aux = rotate(posx, posy, t)
    posx = aux[0], posy = aux[1]
    t += angle
    let times = 0
    let ok = true;
    while(collide(elements, posx, posy)){
      times += 1
      t = parseInt(t)%360
      t += angle
      if(times>=(360/angle)){
        times = 1
        angle = angle /2
      }
      aux = rotate(posx,posy, t)
      posx = aux[0], posy = aux[1]
      if(angle < 1) {
        break
      }
    }
    if(ok){
      elements.push({"radius":radius, "x":posx, "y":posy, "name":dataset[i][0], "real":dataset[i][1]})
      baskets.set(bask,[ count+1,  many+1])
    }
  }
  return elements
}

function sum(la, le ){
  return la + le
}


/* Pulsing effect */ 
function pulsingEffect(num, from, until, delay=1000){
  let houses = [home]
  let len = elements.length
  let step = len / 5
  for (let i = 0; i <= 4; ++i ){
    let aux = parseInt((home+step*i +1))%len
    houses.push()
  }
  
  let aux = 3000;
  
  console.log(houses)
  for(let dur=from; dur<until; dur+=1){
    let cont = houses.length; 
    for(let h=0; h< cont; h++){
      let name = "#dot"+houses[h]
      let dot =   d3.selectAll(name)
      if(dur & 0x01){
      dot.transition()
      .delay(dur*delay +aux)
        .duration(100)
        .attr("r",15);
      }else{
         dot.transition()
        .delay(dur*delay + aux)
        .duration(100)
        .attr("r",10);
      }
    }
  }
}

/* */ 
function translationEffect(_val, _opacity, _delay, _duration){
  let dots = isvg.selectAll("circle")

  dots.transition()
  .delay(_delay)
  .duration(_duration)
  .attr("transform", function(d, i){
    if(  i >= 3 ){
      if( elements[i-numBigCircles] != undefined   ){
        let _str=""
        let val = _val
        let x = elements[i-numBigCircles]["x"]
        let y = elements[i-numBigCircles]["y"]
        let distance = elements[i-numBigCircles]["real"]
        let the = Math.atan2(y, x) * 180 / Math.PI;
        if(the < 0 ) the += 360
        if(distance > 700){
          if(the <=90){
            _str =   "translate("+val+", -"+val+")" // up right
          }else if( the <= 180){
            _str =   "translate(-"+val+", -"+val+")" // up left
          }else if( the <= 270){
            _str =   "translate(-"+val+", +"+val+")" // down left
          }else {
            _str =   "translate("+val+", "+val+")" //down - right
          }
        }else {
          if(the <=90){
            _str =   "translate(-"+val+", +"+val+")" // down left
          }else if( the <= 180){
            _str =   "translate("+val+", "+val+")" //down - right
          }else if( the <= 270){
            _str =   "translate("+val+", -"+val+")" // up right
          }else {
            _str =   "translate(-"+val+", -"+val+")" // up left
          }
        }
        return _str
        }
        
      }
  })
  .attr("opacity", function(d,i){
    if(i <= 2 ){
      return "1"
    } 
    return _opacity
  })
}

function fadingEffect(_duration){
  let dots = isvg.selectAll("circle")
  dots.transition()
  .delay(function(d, i){
    if(i == home) return 200; 
    if(i >= 3 ) {
      let distance = elements[i-numBigCircles]["real"]
       return 1200
    }
  })
  .duration(_duration)
  .attr("opacity", 1)
}


/*
  Paint the circles
*/
function paint(nameDiv){

  let ibody = d3.select("#chart")
  isvg = ibody.append("svg")
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
    .tickValues([300, 900, 1500])
    .tickFormat(function (d) {
      if(d > 0 ) return d
    })
    .tickPadding(5)
    .tickSize(10)
    //.style("font-size", "17px")

  let bol = [
      {id: "bigCircle",radio:1190},
      {id: "middleCircle",radio:700},
      {id: "innerCircle",radio:230}
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
    .attr("opacity", function(d,i){
      if(animate){
        return "0"
      }else{
        return "1"
      }
    }) // ADV : All circles must be hidden at the start
    .attr("id", function(d, i){
      return "dot" + i
    })
    .style("fill", getColor)

  if(animate){
      translationEffect(20,"0",0,0)
      fadingEffect(1000)
      translationEffect(0,"1", 2000, 1000)
      pulsingEffect(1, 1, 1000)
  }
  let arrows = [0,1,2,3,4,5,6,7]
  let arrowsy1 = [22, 22, 100, 100,230, 230, 185, 185]
  let iarrows = isvg.selectAll("line")
    .data(arrows)
    .enter()
    .append("line")

  let iattr = iarrows
    .style("stroke", function(d,i){
      if(i%2==0)return "gray"
      return "gray"
    })
    .style("stroke-width", "3")
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

  //Change size text chart
  isvg.selectAll("text").style("font-size", "14px")

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
    .attr("transform", "translate(" + (width / 2  + 60) + "," + 15 + ")") // text is drawn off the screen top left, move down and out and rotate
    .text("kWh / Month")
    .style("font-size", "17px")


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
        i = (i+1) %2
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
    // home = myhome
    console.log(this.file)
    for( let i = 0; i < this.file.length; i++){
      if(this.file[i]["name"] == myhome){
        home = i
      }
    }
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
