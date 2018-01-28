function printTable(file) {
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(event){
    var csv = event.target.result;
    var data = $.csv.toArrays(csv);
    var html = '';
    var dataj = []
    for(var row in data) {
      html += '<tr>\r';
      for(var item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r';
      }
      if(row > 0){
        dataj.push({name: data[row][0], y:data[row][1]})
      }
      html += '</tr>\r';
    }
    
    let peak1 = new Peak(dataj)
    let myHouse1 = 1
    document.getElementById('chart').innerHTML = ""
    peak1.plot("chart", myHouse1, false)

    $('#contents').html(html);
  };
  reader.onerror = function(){
    alert('Unable to read ' + file.fileName);
  };
}

function selectFile(){
  var icsv = document.getElementById('csv').files[0];
  var  itype = "csv"
  if (!icsv.type.includes(itype)) {
    alert("Please select a csv file")
  }else{
    var mdata = 'Name File : '+ icsv.name;
    mdata +=  '<br> type: '+icsv.type;
    mdata +=  '<br> size: '+icsv.size;
    document.getElementById("result1").innerHTML = mdata;
    printTable(icsv)
  }
}
