d3.csv("PIB_Autos_Marcelo.csv").then((data) => {

    var years = [];
    var autoPIB = [];
    var totalPIB = [];
    var percents = [];

    data.forEach(row =>{
        years.push(row["Anio"]);
        autoPIB.push(row["Automotriz"]*1000000);
        totalPIB.push(row["PIB Total"]);
        percents.push(row["Porcentaje"]);
    })

    console.log(years);

    var trace1 = {
        x: years,
        y: autoPIB,
        name: 'Auto Industry GDP',
        type: 'bar'
      };
      
      var trace2 = {
        x: years,
        y: percents,
        name: '% of Total GDP',
        yaxis: 'y2',
        type: 'scatter'
      };
      
      var data = [trace1, trace2];
      
      var layout = {
        title: 'Auto Industry GDP in Mexico',
        yaxis: {title: 'USD'},
        yaxis2: {
          title: '% of Total GDP',
          titlefont: {color: 'rgb(19, 19, 19)'},
          tickfont: {color: 'rgb(19, 19, 19)'},
          overlaying: 'y',
          side: 'right'
        }
      };
      
      Plotly.newPlot("plotly-id", data, layout);    

})
