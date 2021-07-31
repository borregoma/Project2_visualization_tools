d3.json("/json").then(function(data){
    
    function createObjects(input) {

        if(input === "balance"){
            var geoData = data[0]
        } else if(input === "balanceM"){
            var geoData = data[1]
        } else if(input === "exports"){
            var geoData = data[2]
        } else if(input === "exportsM"){
            var geoData = data[3]
        } else if(input === "sales"){
            var geoData = data[4]
        } else {
            var geoData = data[5]
        }
    
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
                                    '#ffffff' ;
            } else if (input === "sales"){
                return d > 500000 ? '#08306b' :
                d > 200000  ? '#08519c' :
                d > 100000  ? '#2171b5' :
                d > 50000   ? '#4292c6' :
                d > 20000   ? '#6baed6' :
                d > 10000   ? '#9ecae1' :
                d > 5000    ? '#c6dbef' :
                d > 0       ? '#deebf7' :
                                '#ffffff' ;
            } else if (input === "balance"){
                return d > 500000 ? '#00441b' :
                    d > 200000  ? '#006d2c' :
                    d > 100000  ? '#238b45' :
                    d > 50000   ? '#41ab5d' :
                    d > 20000   ? '#74c476' :
                    d > 10000   ? '#a1d99b' :
                    d > 5000    ? '#c7e9c0' :
                    d > 0       ? '#e5f5e0' :
                    d > -1       ? '#ffffff' :
                    d > -5000   ? '#fee0d2' :
                    d > -10000  ? '#fcbba1' :
                    d > -20000  ? '#fc9272' :
                    d > -50000  ? '#fb6a4a' :
                    d > -100000 ? '#ef3b2c' :
                    d > -200000 ? '#cb181d' :
                    d > -500000 ? '#99000d' :
                                '#ffffff';
            } else if(input === "exportsM"){
                return d > 1000000000 ? '#00441b' :
                    d > 500000000  ? '#006d2c' :
                    d > 200000000  ? '#238b45' :
                    d > 100000000  ? '#41ab5d' :
                    d > 50000000   ? '#74c476' :
                    d > 20000000   ? '#a1d99b' :
                    d > 1000000    ? '#c7e9c0' :
                    d > 0          ? '#e5f5e0' :
                                    '#ffffff' ;
            } else if (input === "salesM"){
                return d > 1000000000 ? '#08306b' :
                d > 500000000  ? '#08519c' :
                d > 200000000  ? '#2171b5' :
                d > 100000000  ? '#4292c6' :
                d > 50000000   ? '#6baed6' :
                d > 20000000   ? '#9ecae1' :
                d > 1000000    ? '#c6dbef' :
                d > 0          ? '#deebf7' :
                                '#ffffff' ;
            } else {
                return d > 1000000000? '#00441b' :
                    d > 500000000    ? '#006d2c' :
                    d > 200000000    ? '#238b45' :
                    d > 100000000    ? '#41ab5d' :
                    d > 50000000     ? '#74c476' :
                    d > 20000000     ? '#a1d99b' :
                    d > 1000000      ? '#c7e9c0' :
                    d > 0            ? '#e5f5e0' :
                    d > -1            ?   '#ffffff':
                    d > -1000000     ? '#fee0d2':
                    d > -20000000    ? '#fcbba1':
                    d > -50000000    ? '#fc9272':
                    d > -100000000   ? '#fb6a4a':
                    d > -200000000   ? '#ef3b2c':
                    d > -500000000   ? '#cb181d':
                    d > -1000000000  ? '#99000d':
                    d > -10000000000 ? '#99000d':
                                        '#ffffff';
            }
        };
    
        layerGrouped = [lightmap];
        baseMapsGrouped = {};
        for(var i=2006; i<2021; i++){
            
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
                this._div.innerHTML = '<h6>Vehicle Exports by Destination Country</h6>' +  (props ?
                    '<b>' + props.country + '<br />2020: </b>' + numberWithCommas(props[year2020]) + '<br /><b>2019: </b>'+ numberWithCommas(props[year2019])
                    : 'Hover over a state');
            } else if(input === "sales"){
                this._div.innerHTML = '<h6>Vehicle Sales by Origin Country</h6>' +  (props ?
                    '<b>' + props.country + '<br />2020: </b>' + numberWithCommas(props[year2020]) + '<br /><b>2019: </b>'+ numberWithCommas(props[year2019])
                    : 'Hover over a state');
            } else if(input === "balance"){
                this._div.innerHTML = '<h6>Exports-Sales Balance by Country</h6>' +  (props ?
                    '<b>' + props.country + '<br />2020: </b>' + numberWithCommas(props[year2020]) + '<br /><b>2019: </b>'+ numberWithCommas(props[year2019])
                    : 'Hover over a state');
            } else if(input === "exportsM"){
                this._div.innerHTML = '<h6>Trade Value Exports by Destination Country</h6>' +  (props ?
                    '<b>' + props.country + '<br />2020: </b>' + numberWithCommas(props[year2020]) + '<br /><b>2019: </b>'+ numberWithCommas(props[year2019])
                    : 'Hover over a state');
            } else if(input === "salesM"){
                this._div.innerHTML = '<h6>Trade Value Imports by Origin Country</h6>' +  (props ?
                    '<b>' + props.country + '<br />2020: </b>' + numberWithCommas(props[year2020]) + '<br /><b>2019: </b>'+ numberWithCommas(props[year2019])
                    : 'Hover over a state');
            } else {
                this._div.innerHTML = '<h6>Trade Value Balance by Country</h6>' +  (props ?
                    '<b>' + props.country + '<br />2020: </b>' + numberWithCommas(props[year2020]) + '<br /><b>2019: </b>'+ numberWithCommas(props[year2019])
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
            } else if(input === "balance"){
                var dataRange = [500000, 200000, 100000, 50000, 20000, 10000, 5000, 0, -1, -5000, -10000, -20000, -50000, -100000, -200000, -500000],
                    dataLabels = ["500K+", "200-500K", "100-200K", "50-100K", "20-50K", "10-20K", "5-10K", "0-5K", "0", "-0-10K", "-10-20K", "-20-50K", "-50-100K", "-100-200K", "-200-500K", "-500K"];
            } else if(input === "exportsM"){
                var dataRange = [0, 1000000, 20000000, 50000000, 100000000, 200000000, 500000000, 1000000000],
                    dataLabels = ["<1M", "1-20M", "20-50M", "50-100M", "100M-200M", "200-500M", "500M-1B", "1B"];
            } else if(input === "salesM"){
                var dataRange = [0, 1000000, 20000000, 50000000, 100000000, 200000000, 500000000, 1000000000],
                    dataLabels = ["<1M", "1-20M", "20-50M", "50-100M", "100M-200M", "200-500M", "500M-1B", "1B"];
            } else {
                var dataRange = [1000000000, 500000000, 200000000, 100000000, 50000000, 20000000, 1000000, 1, -1, -1000000, -20000000, -50000000, -100000000, -200000000, -500000000, -1000000000],
                    dataLabels = ["1B+", "500M-1B", "200-500M", "100-200M", "50-100M", "20-50M", "10-20M", "0-10M", "0", "-0-20M", "-20-50M", "-50-100M", "-100-200M", "-200--500M", "-500M-1B", "-1B"];
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
        if(input === "exports"){
            var barcolor = "green"
        } else if(input === "sales"){
            var barcolor = "blue"
        } else if(input === "balance"){
            var barcolor = "orange"
        } else if(input === "exportsM"){
            var barcolor = "green"
        } else if(input === "salesM"){
            var barcolor = "blue"
        } else {
            var barcolor = "orange"
        } 
        var allMetadata = geoData.features
        var countryDict = {};
        allMetadata.forEach((feature) => {
            var defaultYear = input+2019
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
            marker: {color: barcolor}
            
            };
        var barData = [trace1];
    
        var steps = []
        var frames = []
        for(var i=2006; i<2021; i++){
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
    
        // JSC
        d3.select("#jsc-id").html(" ");
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
        if(input === "exports"){
            var maxValues = [ 
                650000, 
                550000, 
                850000, 
                200000, 
                550000, 
                200000, 
                550000 
                ];
        } else if(input === "sales"){
            var maxValues = [ 
                140000, 
                180000, 
                320000, 
                900000, 
                420000, 
                120000, 
                220000 
                ];
        } else {
            var maxValues = [ 
                600000, 
                450000,
                650000, 
                120000, 
                260000, 
                90000, 
                400000
                ];
        }
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
    
        if(input === "salesM"){
            input = "sales";
        } else if(input === "exportsM"){
            input = "exports";
        } else if(input === "balanceM"){
            input = "balance";
        }
        JSC.fetch('brand'+input+'.csv') 
        .then(function(response) { 
        return response.text(); 
        }) 
        .then(function(text) { 
        var dataGrid = JSC.csv2Json(text); 
        grid = renderGrid(dataGrid); 
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
            
            return JSC.Grid('jsc-id', { 
            data: gridData, 
            className: 'dataTable'
            }); 
        };
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
    
    function numberWithCommas(x) {
        if(!x){
            return 0
        } else {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }


})
