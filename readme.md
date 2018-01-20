
## Requirements
  - [D3js](https://d3js.org/d3.v4.min.js)

## How to use it?

### With a CSV file
```js
let peak = new Peak("../data1.csv")
        // new Radial("../data1.csv")
        // new BlackHole("../data1.csv")
let myHouse = 15
peak.plot("chart", myHouse)
```

### With an array
```js
let data  = [
  {name:"House1",y:600},
  {name:"House2",y:750},
  {name:"House3",y:800},
  {name:"House4",y:900},
  {name:"House5",y:1000},
  {name:"House6",y:900},
  {name:"House7",y:700},
  {name:"House8",y:900},
  {name:"House9",y:800},
  {name:"House10",y:1000},
  {name:"House11",y:700},
  {name:"House12",y:600}
]
let peak =  new Peak(data)
        //  new BlackHole(data)
        //  new Radial(data)
let myHouse = 15
peak.plot("chart", myHouse, false)
```

### Contributors

#### Designer
* Name:  Marlen Promann

#### Developer
* Name : Daniel Santos
* Email : dfsantosbu@unal.edu.co

### License
MIT
