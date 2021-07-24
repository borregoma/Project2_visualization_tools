function createObjects(input) {
    d3.json(input+".geojson").then(function(geoData) {

        ///////LEAFLET///////
        d3.select("#map-id").html(" ");
        var container = L.DomUtil.get('map-id');
        if(container != null){
        container._leaflet_id = null;
        }

        var year2020 = input+"2020";
        var year2019 = input+"2019";

        var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
            id: "light-v10",
            accessToken: API_KEY
        });
    
        function getColor(d) {
            if(input === "exports"){
                return d > 1000000 ? '#00441b' :
                   d > 500000  ? '#006d2c' :
                   d > 200000  ? '#238b45' :
                   d > 100000  ? '#41ab5d' :
                   d > 50000   ? '#74c476' :
                   d > 20000   ? '#a1d99b' :
                   d > 10000   ? '#c7e9c0' :
                   d > 0       ? '#e5f5e0' :
                                 '#ECECED' ;
            } else if (input === "sales"){
                return d > 500000 ? '#08306b' :
                d > 200000  ? '#08519c' :
                d > 100000  ? '#2171b5' :
                d > 50000   ? '#4292c6' :
                d > 20000   ? '#6baed6' :
                d > 10000   ? '#9ecae1' :
                d > 5000    ? '#c6dbef' :
                d > 0       ? '#deebf7' :
                              '#ECECED' ;
            } else {
                return d > 500000 ? '#00441b' :
                   d > 200000  ? '#006d2c' :
                   d > 100000  ? '#238b45' :
                   d > 50000   ? '#41ab5d' :
                   d > 20000   ? '#74c476' :
                   d > 10000   ? '#a1d99b' :
                   d > 5000    ? '#c7e9c0' :
                   d > 0       ? '#e5f5e0' :
                   d > -5000   ? '':
                   d > -10000  ? '':
                   d > -20000  ? '':
                   d > -50000  ? '':
                   d > -100000 ? '':
                   d > -200000 ? '':
                   d > -500000 ? '':
                                 '#ECECED' ;
            }
        };
    
        layerGrouped = [lightmap];
        baseMapsGrouped = {};
        for(var i=2005; i<2021; i++){
            
            function styleSales(feature) {
                var year = i
                var yearSelected = input+year
                return {
                    fillColor: getColor(feature["properties"][yearSelected]),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '2',
                    fillOpacity: 0.7
                };
            }
    
            function highlightFeature(e) {
                var layer = e.target;
        
                layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                });
        
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
                info.update(layer.feature.properties);
            }
        
            function resetHighlight(e) {
                var layer = e.target;
        
                layer.setStyle({
                    weight: 2,
                    color: 'white',
                    dashArray: '2',
                    fillOpacity: 0.7
                });
                info.update();
            }
        
            function zoomToFeature(e) {
                myMap.fitBounds(e.target.getBounds());
            }
        
            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
            }
    
            var newLayer = new L.layerGroup();
            L.geoJson(geoData, {style: styleSales, onEachFeature: onEachFeature}).addTo(newLayer);
            if(i===2020){
                layerGrouped.push(newLayer);            
            }
            baseMapsGrouped[i] = newLayer;
        }
        
        var myMap = L.map("map-id", {
            center: [30, 20],
            zoom: 1,
            layers: layerGrouped
        });
    
        var baseMaps = baseMapsGrouped;
    
        var overlayMaps = {
            "Light Map": lightmap,
        };
        
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: true,
            position: "topleft"
        }).addTo(myMap);
    
        var info = L.control();
    
        info.onAdd = function (myMap) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };
    
        info.update = function (props) {
            if(input === "exports"){
                this._div.innerHTML = '<h4>Vehicle Exports by Destination Country</h4>' +  (props ?
                    '<b>' + props.country + '<br />2020: </b>' + props[year2020] + '<br /><b>2019: </b>'+ props[year2019]
                    : 'Hover over a state');
            } else if(input === "sales"){
                this._div.innerHTML = '<h4>Vehicle Sales by Origin Country</h4>' +  (props ?
                    '<b>' + props.country + '<br />2020: </b>' + props[year2020] + '<br /><b>2019: </b>'+ props[year2019]
                    : 'Hover over a state');
            } else {
                this._div.innerHTML = '<h4>Exports-Sales Balance by Country</h4>' +  (props ?
                    '<b>' + props.country + '<br />2020: </b>' + props[year2020] + '<br /><b>2019: </b>'+ props[year2019]
                    : 'Hover over a state');
            }
            
        };
    
        info.addTo(myMap);
    
        var legend = L.control({position: 'bottomright'});
    
        legend.onAdd = function (myMap) {
            var div = L.DomUtil.create('div', 'info legend')
            if(input === "exports"){
                var dataRange = [0, 10000, 20000, 50000, 100000, 200000, 500000, 1000000],
                    dataLabels = ["<10K", "10-20K", "20-50K", "50-100K", "100-200K", "200-500K", "500K-1M", "1M"];
            } else if(input === "sales") {
                var dataRange = [0, 5000, 10000, 20000, 50000, 100000, 200000, 500000],
                    dataLabels = ["<5K", "5-10K", "10-20K", "20-50K", "50-100K", "100-200K", "200-500K", "500K"];
            } else {
                var dataRange = [500000, 200000, 100000, 50000, 20000, 10000, 5000, 1, -1, -5000, -10000, -20000, -50000, -100000, -200000, -500000],
                    dataLabels = ["500K+", "200-500K", "100-200K", "50-100K", "20-50K", "10-20K", "5-10K", "0-5K", "0--5K", "5--10K", "10--20K", "20--50K", "50--100K", "100--200K", "200--500K", "-500K"];
            }
            for (var i = 0; i < dataRange.length; i++) {
                div.innerHTML +=
                '<i style="background:' + getColor(dataRange[i] + 1) + '"></i> ' +
                dataLabels[i] + (dataLabels[i + 1] ? '<br>' : '+');
            }
    
            return div;
        };
    
        legend.addTo(myMap);

        ///////PLOTLY///////
        var allMetadata = geoData.features
        var countryDict = {};
        allMetadata.forEach((feature) => {
            var defaultYear = input+2016
            countryDict[feature.properties.country] = feature["properties"][defaultYear]
        })
        newDict = sortObjectEntries(countryDict);
        var countriesSliced = newDict.map(d => d[0]).slice(0,10).reverse();
        var xdataSliced = newDict.map(d => d[1]).slice(0,10).reverse();

        var trace1 = {
            x: xdataSliced,
            y: countriesSliced,
            text: countriesSliced,
            name: input,
            type: "bar",
            orientation: "h",
            color: "red"
            };
        var barData = [trace1];

        var steps = []
        var frames = []
        for(var i=2005; i<2021; i++){
            var eachStep = {
                label: `${i}`,
                method: 'animate',
                args: [[`${i}`],{
                    mode: 'immediate',
                    frame: {redraw: false, duration: 1000},
                    transition: {duration: 1000}
                }]
            }
            steps.push(eachStep)

            var countryDictFor = {};
            allMetadata.forEach((feature) => {
                var year = i
                var yearSelected = input+year
                countryDictFor[feature.properties.country] = feature["properties"][yearSelected];
            })
            newDict = sortObjectEntries(countryDictFor);
            var countriesSlicedFor = newDict.map(d => d[0]).slice(0,10).reverse();
            var xdataSlicedFor = newDict.map(d => d[1]).slice(0,10).reverse();

            var eachFrame = {
                name: `${i}`, 
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
                    frame: {redraw: false, duration: 1000},
                    transition: {duration: 500}
                }]
            },{
                label: 'Reset',
                method: 'animate',
                args: [null, {
                    frame: {duration: 0, redraw: false}, 
                    mode: 'immediate'
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
            transition: {duration: 250},
            steps: steps
        }]

        var barLayout = {
            title: "Top 10 Countries",
            sliders: sliders,
            updatemenus: updatemenus
        };

        Plotly.newPlot("plotly-id", {
            data: barData,
            layout: barLayout,
            frames: frames
        })
    })
}

function sortObjectEntries(obj){
    return  Object.entries(obj).sort((a,b)=>b[1]-a[1]);
}


createObjects("exports");

d3.selectAll("#dataButton").on("click", function(){
    d3.selectAll("#dataButton").attr("class", "btn btn-secondary");
    d3.select(this).attr("class", "btn btn-primary");
    var input = d3.select(this).attr("value");
    createObjects(input)
})

