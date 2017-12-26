'use strict'
let height=450
let width=height
let Maxradius=15
let len=0
let x0=50
let y0=30
let home=0
let maxValue=1500
let minX=0
let margin={top:20,right:40,bottom:40,left:300};let legendRectSize=18
let legendSpacing=4
let color=d3.scaleOrdinal(d3.schemeCategory20b);let customColors=["#A6A6A6","#595959"]
let labelsLegends=[{label:'Your household'},{label:'Other households'}];let elements=[]
let iradios=[]
let radius=0
let delta=0
let xscale=d3.scaleLinear().domain([0,maxValue]).range([0,width]);let yscale=d3.scaleLinear().domain([0,maxValue]).range([height,0])
function getRadius(r){return xscale(r)}
function getX(e,r){return xscale(elements[r].x)-minX}
function getY(e,r){return yscale(elements[r].y)+y0}
function getColor(d,i){if(i==home)return customColors[0]
return customColors[1]}
function getBask(n){let bask=parseFloat(n)/maxValue*10.0
return parseInt(bask)}
function collide(circles,x,y){let n=circles.length
for(let i=0;i<n;i++){let c=circles[i]
if(c.x==0&&c.y==0)continue
if(Math.pow(c.x-x,2)+Math.pow(c.y-y,2)<Math.pow(2*radius,2))return!0}
return!1}
function generate(dataset,baskets){let cont=0,posx=0,posy=0
let n=dataset.length
console.log(baskets)
for(let i=0;i<n;++i){let bask=getBask(dataset[i][1])
posy=dataset[i][1]
let many=baskets.get(bask)[1]
let count=baskets.get(bask)[0]
if(many==0){posx=width/2}else if(many%2!=0){posx=width/2+2*radius*((many+1)/2)+delta*(many+1)}else{posx=width/2-2*radius*(many/2)-delta*(many+1)}
while(collide(elements,posx,posy)){console.log("mgd")
if(many%2!=0){posx+=5}else{posx-=5}}
if(posx<0){minX=Math.min(minX,posx)
console.log(minX)}
elements.push({"radius":radius,"x":posx,"y":posy,"name":dataset[i][0]})
baskets.set(bask,[count,many+1])}
return elements}
function paint(nameDiv){let ibody=d3.select("#"+nameDiv)
let isvg=ibody.append("svg").attr("width",width+margin.left+margin.right).attr("height",height+margin.left+margin.right).attr("transform","translate("+(margin.left+35)+","+margin.top+")")
let x_axis=d3.axisBottom().scale(xscale).ticks(0)
let y_axis=d3.axisLeft().scale(yscale).tickPadding(7).ticks(5).tickValues(d3.range(0,maxValue+100,300)).tickSize(0,0)
let icircles=isvg.selectAll("circle").data(iradios).enter().append("circle")
isvg.append("g").attr("transform","translate("+x0+", "+y0+")").call(y_axis);isvg.append("g").attr("transform","translate("+x0+", "+(height+y0)+")").style("stroke-dasharray",("10, 10")).call(x_axis)
isvg.append("text").attr("text-anchor","middle").attr("transform","translate("+15+","+(height/2)+")rotate(-90)").text("kWh / Month");let iattr=icircles.attr("cx",getX).attr("cy",getY).attr("r",getRadius).style("fill",getColor)
let legend=isvg.selectAll('.legend').data(labelsLegends).enter().append('g').attr('class','legend').attr('transform',function(d,i){let h=legendRectSize+legendSpacing;let offset=h*color.domain().length/2;let horz=i*7*h-offset+width/4+40*i
let vert=(height+y0+30)
return'translate('+horz+','+vert+')'});legend.append('circle').attr('r',10).style('fill',function(d,i){return customColors[i]}).style('stroke',"black");legend.append('text').attr('x',legendRectSize+legendSpacing).attr('y',legendRectSize-legendSpacing-8).text(function(d){return d.label})}
class BlackHole{constructor(nameFile){this.nameFile=nameFile}
plot(nameDiv,myhome,flag=!0){const arrayColumn=(arr,n)=>arr.map(x=>x[n])
home=myhome
d3.csv(this.nameFile,function(data){if(flag){let dataset=[]
let basket=new Map()
for(let e in data){let info=data[e]
let name=info.name
let value=parseInt(info.y)
if(name){dataset.push([name,value])
let x=getBask(value)
if(!basket.has(x)){basket.set(x,[0,0])}else{basket.set(x,[basket.get(x)[0]+1,0])}}}
radius=Math.min(60,parseInt(26*60/dataset.length))
elements=generate(dataset,basket)}else{for(let e in data){let info=data[e]
let name=info.name
if(info.y){let value=parseInt(info.radius)
let y=parseInt(info.y)
let x=parseInt(info.x)
radius=value
if(x<0){minX=Math.min(minX,x)}
elements.push({"radius":value,"y":y,"x":x,"name":name})}}}
len=elements.length
iradios=arrayColumn(elements,"radius")
paint(nameDiv)})}}
