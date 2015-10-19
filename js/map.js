(function(){

  var map;

  window.onload = function() {
  	drawMap();
  };


  // Function to draw the initial map
  var drawMap = function() {
    map = L.map('container').setView([35, -100], 5);

    var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

    layer.addTo(map)

    getData();
  }

  // Function for getting data
  var getData = function() {
    var ajax = new XMLHttpRequest();
    ajax.onload = customBuild;
    ajax.open("GET", "data/response.json", true);
    ajax.send();
  }

  // Uses the data to generate points on the map
  var customBuild = function() {

    var json = JSON.parse(this.responseText);
    
    //initialize layers based on victim's race
    var white = new L.LayerGroup([]);
    var black = new L.LayerGroup([]);
    var asian = new L.LayerGroup([]);
    var indianNative = new L.LayerGroup([]);
    var island = new L.LayerGroup([]);
    var other = new L.LayerGroup([]);
    var allLayers = [white, black, asian, indianNative, island, other];

    //initialize counts for the table
    var whiteMale = 0;
    var whiteWomanUnspecified = 0;
    var nonWhiteMale = 0;
    var nonWhiteWomanUnspecified = 0;


    for(var i = 0; i < json.length; i++){
      var curr = json[i];

      //get relevant data
      var lat = curr["lat"];
      var lng = curr["lng"];
      var race = curr["Race"];
      var summary = curr["Summary"];
      var link = curr["Source Link"];
      var gender = curr["Victim's Gender"];

      //increment table counts
      if(gender == "Male"){
        race == "White" ? whiteMale++ : nonWhiteMale++;
      }else{
        race == "White" ? whiteWomanUnspecified++ : nonWhiteWomanUnspecified++;
      }

      //choose color based on "hit or killed"
      var currColor = 'black';
      if(curr["Hit or Killed?"] == 'Killed'){
        currColor = 'red';
      }
      
      //add circle to correct layer
      var circle = new L.circleMarker([lat, lng], {color: currColor});
      if(race == "White"){
        circle.addTo(white);
      }else if(race == "Black or African American"){
        circle.addTo(black);
      }else if(race =="Asian"){
        circle.addTo(asian);
      }else if(race == "American Indian or Alaska Native"){
        circle.addTo(indianNative);
      }else if(race == "Native Hawaiian or Other Pacific Islander"){
        circle.addTo(island);
      }else{
        circle.addTo(other)
      }
      circle.bindPopup(summary + "<a href=\"" + link + "\"> link </a>" );
    }

    for(var i = 0; i < allLayers.length; i++){
      map.addLayer(allLayers[i]);
    }
    

    $("#white-male").html(whiteMale);
    $("#white-woman").html(whiteWomanUnspecified);
    $("#non-male").html(nonWhiteMale);
    $("#non-woman").html(nonWhiteWomanUnspecified);
    // + " " + nonWhiteMale + " " + whiteWomanUnspecified + " " + nonWhiteWomanUnspecified);

    L.control.layers(null,{"Other":other, "White":white,"Black or African-American":black, "Asian": asian, "American Indian or Alaska Native": indianNative, "Native Hawaiian or Other Pacific Islander": island}).addTo(map);
    //var circle = new L.circleMarker([36, -101], options);
  	// Be sure to add each layer to the map

  	// Once layers are on the map, add a leaflet controller that shows/hides layers
    
  }

})();
