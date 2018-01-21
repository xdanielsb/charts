Data-Visualization
====================

This project provides Javascript libraries for visualizing data.  These libraries are built over D3, using web standards you can display your data.

Resources
---------
  * [Examples](https://xdanielsb.github.io/Energy/)


Installing
----------

This projects is over d3 so you must include **D3.js** version 4. Depending on the visualization that you want to use you must include one the following scripts

#### Radial
```html
  <script src="code_radial$.js"></script>
```

#### Peaks
```html
  <script src="code_peak$.js"></script>
```

#### Black
```html
  <script src="code_black$.js"></script>
```

## Configuration in your html

```html
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="code_black$.js"></script>
    <title>Tittle</title>
  </head>
  <body>
    <div id="chart"></div>
    <!-- Here you call the library inside an script tag, see below the description of usage -->
  </body>

</html>
```


Usage
-----

#### With a CSV file
```js
let peak = new Peak("../data1.csv")
        // new Radial("../data1.csv")
        // new BlackHole("../data1.csv")
let myHouse = 15
peak.plot("chart", myHouse)
```

#### With an array
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

Contributors
------------

#### Designer
* Name:  Marlen Promann
* Email: marlen.promann@gmail.com
* GitHub : [Promann](https://github.com/promann)

#### Developer
* Name : Daniel Santos
* Email : dfsantosbu@unal.edu.co
* Github : [XDanielsb](https://github.com/xdanielsb)

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
