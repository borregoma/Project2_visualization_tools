d3.csv("PIB_Autos_Marcelo.csv").then((data) => {

    var years = [];
    var autoPIB = [];
    var totalPIB = [];
    var percents = [];

    data.forEach(row =>{
        years.push(row["Anio"]);
        autoPIB.push(row["Automotriz"]);
        totalPIB.push(row["PIB Total"]);
        percents.push(row["Porcentaje"]);
    })

    console.log(years);

    var trace1 = {
        x: years,
        y: autoPIB,
        name: 'yaxis data',
        type: 'bar'
      };
      
      var trace2 = {
        x: years,
        y: percents,
        name: 'yaxis2 data',
        yaxis: 'y2',
        type: 'scatter'
      };
      
      var data = [trace1, trace2];
      
      var layout = {
        title: 'Double Y Axis Example',
        yaxis: {title: 'yaxis title'},
        yaxis2: {
          title: 'yaxis2 title',
          titlefont: {color: 'rgb(148, 103, 189)'},
          tickfont: {color: 'rgb(148, 103, 189)'},
          overlaying: 'y',
          side: 'right'
        }
      };
      
      Plotly.newPlot("plotly-id", data, layout);    

})
