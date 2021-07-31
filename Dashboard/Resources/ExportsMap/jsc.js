// JS 
var grid, 
  palette = [ 
    '#81d4fa', 
    '#80cbc4', 
    '#c5e1a5', 
    '#ffe082', 
    '#ffab91', 
    '#f48fb1', 
    '#9fa8da'
  ]; 
var maxValues = [ 
  500000, 
  500000, 
  500000, 
  500000, 
  500000, 
  500000, 
  500000 
]; 

function createObjects(input){
    JSC.fetch('brand'+input+'.csv') 
    .then(function(response) { 
      return response.text(); 
    }) 
    .then(function(text) { 
      var data = JSC.csv2Json(text); 
      grid = renderGrid(data); 
    }); 
    
  function renderGrid(data) { 
    var gridData = JSC.nest() 
      .key('ANIO') 
      .pointRollup(function(key, val) { 
        var vendorData = { ' ': key }; 
        for (var i = 0; i < val.length; i++) { 
          vendorData[val[i].MARCA] = 
            '<absolute><chart type=bar size=70x24 max=' + 
            maxValues[i] + 
            ' data=' + 
            val[i].UNI_VEH + 
            ' colors=' + 
            palette[i] + 
            ',,none>' + 
            '<span style="width:40px; margin:5px 3px; color:#424242;">' + 
            JSC.formatNumber(val[i].UNI_VEH, 'n0') + 
            '</span></absolute>'; 
        } 
        return vendorData; 
      }) 
      .points(data); 
    
    return JSC.Grid('plotly-id', { 
      data: gridData, 
      className: 'dataTable'
    }); 
  } 
}

createObjects("exports");