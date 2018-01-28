function printTable(file) {
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(event){
    var csv = event.target.result;
    var data = $.csv.toArrays(csv);
    var html = '';
    for(var row in data) {
      html += '<tr>\r';
      for(var item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r';
      }
      html += '</tr>\r';
    }
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
