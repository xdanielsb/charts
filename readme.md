## Visualizations
 - ### Peak
    - [View](https://xdanielsb.github.io/EnergyVis/base/b1/b1.html)
    - [How to use it?](/base/b1/readme.md)
    - [Library](/base/b1/peak.js)

 - ### Black Hole
    - [View](https://xdanielsb.github.io/EnergyVis/base/b2/b2.html)
    - [How to use it?](/base/b2/readme.md)
    - [Library](/base/b2/blackHole.js)

 - ### Radial
    - [View](https://xdanielsb.github.io/EnergyVis/base/b3/b3.html)
    - [How to use it?](/base/b3/readme.md)
    - [Library](/base/b3/radial.js)


## Requirements
  - [D3js](https://d3js.org/d3.v4.min.js)

## General structure to use

### #Index
```html
<head>
  <script src="https://d3js.org/d3.v4.min.js"></script>
  <script src="library_name.js"></script>
  <title>Name Page</title>
  <!-- CSS Style -->
</head>
<body>
  <h2 class="tittle">Name Chart</h2>
  <!-- div which is going to contain the chart. -->
  <div id="chart"></div>
  <script>
    /*
      Library = { Radial, BlackHole, Peak}
    */
    let bh = new Library("dataset.csv")
    let myHouse = 15
    let idDiv = "chart"
    bh.plot(idDiv, myHouse)
  </script>
</body>
</html>
```

### #Style
```css
.tittle{
  font-family: 'Open Sans',serif;
}
.legend {
  font-size: : 12px;
  font-family: 'Open Sans',serif;
}
```

### #Dataset -> CSV File

```csv
name,y
House1,600
House2,750
House3,800
```

### License
MIT
**Free Software, It's the right way  to do things!**

### About the author

* Name : Daniel Santos
* Email : dfsantosbu@unal.edu.co
