


d3.json("sales.geojson").then((worldData) => {

    var allMetadata = worldData.features
    var countryDict = {};
    allMetadata.forEach((feature) => {
        countryDict[feature.properties.country] = feature.properties.sales2020
    })
    newDict = sortObjectEntries(countryDict);
    var countriesSliced = newDict.map(d => d[0]).slice(0,10).reverse();
    var xdataSliced = newDict.map(d => d[1]).slice(0,10).reverse();

    var trace1 = {
        x: xdataSliced,
        y: countriesSliced,
        text: countriesSliced,
        name: "First Try",
        type: "bar",
        orientation: "h"
        };
    var barData = [trace1];

    var steps = []
    var frames = []
    for(var i=2005; i<2022; i++){
        var eachStep = {
            label: `sales${i}`,
            method: 'animate',
            args: [[`sales${i}`],{
                mode: 'immediate',
                frame: {redraw: false, duration: 1000},
                transition: {duration: 1000}
            }]
        }
        steps.push(eachStep)

        var countryDictFor = {};
        allMetadata.forEach((feature) => {
            var year = i
            var yearSelected = "sales"+year
            countryDictFor[feature.properties.country] = feature["properties"][yearSelected];
        })
        newDict = sortObjectEntries(countryDictFor);
        var countriesSlicedFor = newDict.map(d => d[0]).slice(0,10).reverse();
        var xdataSlicedFor = newDict.map(d => d[1]).slice(0,10).reverse();

        var eachFrame = {
            name: `sales${i}`, 
            data: [{
                x: xdataSlicedFor,
                y: countriesSlicedFor
            }]
        }
        frames.push(eachFrame)
    }
    var updatemenus = [{
        type: 'buttons',
        showactive: false,
        x: 0.05,
        y: 0,
        xanchor: 'right',
        yanchor: 'top',
        pad: {t:60, r:20},
        buttons: [{
            label: 'Play',
            method: 'animate',
            args: [null, {
                fromcurrent: true, 
                frame: {redraw: false, duration: 2000},
                transition: {duration: 1000}
            }]
        }]
    }]

    var sliders = [{
        pad: {t:30},
        x: 0.05,
        len: 0.95,
        currentvalue: {
            xanchor: 'right',
            prefix: 'Year: ',
            font: {
                color: '#888',
                size: 20
            }
        },
        transition: {duration: 1000},
        steps: steps
    }]

    var barLayout = {
        title: "Top 10 Countries",
        sliders: sliders,
        updatemenus: updatemenus
    };

    // Plotly.newPlot("map-id", barData, barLayout, [frames]);
    Plotly.newPlot("map-id", {
        data: barData,
        layout: barLayout,
        frames: frames
    })
        console.log(frames)
})

function sortObjectEntries(obj){
    return  Object.entries(obj).sort((a,b)=>b[1]-a[1]);
}
