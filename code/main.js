$(function() {
   // Setup leaflet map

   var map = new L.Map('map');
   //osm layout
   var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  osm.addTo(map);

  // Satellite map
  googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

  // googleSat.addTo(map);

    // Hybird map
  googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

  //  googleHybrid.addTo(map);

  
  // Terrain map
  googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

  // googleTerrain.addTo(map);


  var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');

  // Center map and default zoom level
  map.setView([21.0068104, 105.854852,], 14);
  // var map = L.map('map').setView([21.0068104, 105.854852], 15);


  // Adds the background layer to the map
  map.addLayer(basemapLayer);
  
    // Colors for AwesomeMarkers
    var _colorIdx = 0,
        _colors = [
          'orange',
          'red',
          'green',
          'blue',
          'purple',
          'darkred',
          'cadetblue',
          'darkgreen',
          'darkblue',
          'darkpurple'
        ];
        
    function _assignColor() {
        return _colors[_colorIdx++%10];
    }
    
    // =====================================================
    // =============== Playback ============================
    // =====================================================

    // Playback options
    var playbackOptions = {        
        // layer and marker options
        layer: {
            pointToLayer : function(featureData, latlng){
                var result = {};
                
                if (featureData && featureData.properties && featureData.properties.path_options){
                    result = featureData.properties.path_options;
                }
                
                if (!result.radius){
                    result.radius = 5;
                }
                
                return new L.CircleMarker(latlng, result);
            }
        },
        
        marker: function(){
            return {
                icon: L.AwesomeMarkers.icon({
                    prefix: 'fa',
                    icon: 'bullseye', 
                    markerColor: _assignColor()
                }) 
            };
        }        
    };
    
    // Layer controller
    var baseMaps = {
        "OSM": osm,
        "Google Hybird map": googleHybrid,
        "Google Satellite map": googleSat,
        "Google Terrain map": googleTerrain
    };

    
    L.control.layers(baseMaps).addTo(map);

    map.on('mousemove', function (e) {
        document.getElementsByClassName('coordinate')[0].innerHTML = 'lat: ' + e.latlng.lat + ' lng: ' + e.latlng.lng;
        // console.log('lat: ' + e.latlng.lat, 'lng: ' + e.latlng.lng)
        
    })


    // Initialize playback
    var playback = new L.Playback(map, demoTracks, null, playbackOptions);
    
    // Initialize custom control
    var control = new L.Playback.Control(playback);
    control.addTo(map);
    
    // Add data
    // playback.addData(blueMountain);
       
});
