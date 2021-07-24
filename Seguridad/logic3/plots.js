// Trace1 for the Greek Data
//var trace1 = {
//  x: ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
//    "Coahuila de Zaragoza", "Colima", "Chiapas", "Chihuahua","Ciudad de Mexico",
//     "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Mexico", "Michoacán de Ocampo",
//       "Morelos", "Nayarit", "Nuevo Leon", "Oaxaca", "Puebla", "Queretaro","Quintana Roo", "San Luis Potosi",
//         "Sinaloa", "Sonora", "Tabasco", "Tlaxcala", "Veracruz de Ignacio de la Llave", "Yucatan", "Zacatecas"],

//  y: [23212,23729,33548,38834,38429,33626,14910,119944,109109,111722,103028,104013,92168,39050,21415,24606,24174],
//  text: [2015, 2016, 2017, 2018, 2019, 2020, 2021],
//  type: "bar"
//};

// Trace 2 for the Roman Data
var trace2 = {
  x: csvjson.map(row => row.Entidad),
  y: csvjson.map(row => row.Delitos),
  text: csvjson.map(row => row.Ano),
  name: "Total Crime Incidents",
  type: "bar"
};

// Combining both traces
var traceData = [trace2];

// Apply the group barmode to the layout
var layout = {
  title: "Crime in Mexico by State",
  barmode: "group"
};

// Render the plot to the div tag with id "plot"
Plotly.newPlot("plot", traceData, layout);

















