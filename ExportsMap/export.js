d3.json("exports.geojson").then(function(worldData) {

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
    });

    function getColor(d) {
        return d > 1000000 ? '#800026' :
               d > 500000  ? '#BD0026' :
               d > 200000  ? '#E31A1C' :
               d > 100000  ? '#FC4E2A' :
               d > 50000   ? '#FD8D3C' :
               d > 20000   ? '#FEB24C' :
               d > 10000   ? '#FED976' :
               d > 0       ? '#FFEDA0' :
                             '#ECECED' ;
    }

    layerGrouped = [lightmap];
    baseMapsGrouped = {};
    for(var i=2005; i<2022; i++){
        
        function styleSales(feature) {
            var year = i
            var yearSelected = "exports"+year
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
        }
    
        function resetHighlight(e) {
            var layer = e.target;
    
            layer.setStyle({
                weight: 2,
                color: 'white',
                dashArray: '2',
                fillOpacity: 0.7
            });
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
        L.geoJson(worldData, {style: styleSales, onEachFeature: onEachFeature}).addTo(newLayer);
        if(i===2021){
            layerGrouped.push(newLayer);            
        }
        baseMapsGrouped[i] = newLayer;
    }
    
    var myMap = L.map("map-id", {
        center: [50, -10],
        zoom: 3,
        layers: layerGrouped
    });

    var baseMaps = baseMapsGrouped;

    var overlayMaps = {
        "Light Map": lightmap,
    };
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var info = L.control();

	info.onAdd = function (myMap) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>Exported Vehicles</h4>' +  (props ?
			'<b>' + props.country + '</b><br />' + props.sales2021 + ' vehicles / mi<sup>2</sup>'
			: 'Hover over a state');
	};

	info.addTo(map);

})






    
    