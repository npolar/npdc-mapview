'use strict';

var MapviewShowController = function($controller, $routeParams,$scope, $q, Mapview, npdcAppConfig, NpolarApiSecurity, npolarApiConfig, MapviewService) {
    'ngInject';

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = Mapview;


  //$scope.map = {};

  //Show map in Antarctica or Svalbard
  let arctic = [78.000, 16.000];
  let antarctica = [-72.01667, 2.5333];
  let maps = [arctic, antarctica];

  //initialize with map from the Arctic
  let mapselect = maps[0];

  //Build map
  var L = require('leaflet');
  L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

  var map = L.map('mapid', {
      fullscreenControl: true,
      fullscreenControlOptions: {
      position: 'topleft'
  }}).setView(mapselect, 4);

  L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}/', {
      maxZoom: 18,
      attribution: 'Esmapri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
  }).addTo(map);

  // Initialise the FeatureGroup to store editable layers
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  //Filter button
  $scope.filter = function() {
      let new_map =  maps[($scope.map_select.selectedOption.id)-1];
      map.setView(new L.LatLng(new_map[0], new_map[1]), 4);
  };
  //Reset button
  $scope.reset = function() {
      console.log("reset", $scope);
      $scope.map.selectedOption = {id: '1', name: 'Arctic'};
  };

    //Leaflet have problems with finding the map size
    //invalidateSize checks if the map container size has changed and updates map.
    //Since map resizing is done by css, need to delay the invalidateSize check.
    setTimeout(function(){ map.invalidateSize();}, 20);


    let show = function() {


     $scope.show().$promise.then((mapview) => {

       //Show database name as title
       let db = $scope.document.target_database;
       $scope.document.target_database = db.charAt(0).toUpperCase() + db.slice(1);

       //Create map object - select menu
       let map_arr=($scope.document.map).split(",");

        console.log(map);
        map.setView(new L.LatLng(-72.01667, 2.5333), 4);

//       if (map_arr[0] === 'Antactica') {
//           console.log(maps[1][0],maps[1][1]);
//            map.setView(new L.LatLng(-72.01667, 2.5333), 4);
//       };

       let availableOptions = [];
       for (let i = 0; i < map_arr.length; i++) {
          availableOptions.push({ id:(i+1).toString(), name:map_arr[i] });
       }

       $scope.map_select = {
        availableOptions: availableOptions,
        selectedOption: {id: '1', name: map_arr[0]}
       };




       Search($scope.document,db);

    });  //promise
  }; //show

  show();

  function Search(doc,db){

     //Fetch fields to search for
      let fields = "id," + doc.geojson +
        //  ',' + $scope.document.select_parameters.parameter +
          ',' + doc.display_parameters.parameters +
          ',' + doc.display_parameters.main_heading +
          ',' + doc.display_parameters.top_heading;

      //Fetch data
      let link =  npolarApiConfig.base + "/" + db +"/?q=&format=json&fields=" + fields;

      MapviewService.getValues(link).then
        // on success
        (function(results) {
            GetCoverage(results.data);
        }),
        //on failure
        (function(response,status){
            console.log("The request failed with response " + response + " and status code " + status);
        }); //end getValues
  };

  // Estimate the diagram values
  function GetCoverage(data) {

     //console.log(data);

      //Get objects with locations, forget the rest
      let coverage;
      let len = data.feed.entries.length;

      //loop through entries
      for (let i = 0; i < len; i++) {
           //if locations exist and north is arctic
           if ((data.feed.entries[i].hasOwnProperty('locations'))&&(data.feed.entries[i].locations.north>0)&&(mapselect===arctic)){
             let loc = data.feed.entries[i].locations;
             console.log(loc.north, loc.south, loc.west, loc.east);
                if ((loc.north === loc.south) && (loc.east === loc.west)) {
                    var popup = L.popup().setLatLng([loc.north, loc.west]).setContent("Point").openOn(map);
                } else {
                     coverage = [[loc.north, loc.west], [loc.north, loc.east],[loc.south, loc.east], [loc.south, loc.west]];
                      L.polygon(coverage).addTo(map).bindPopup("Polygon").openPopup();
                }

           //    map.fire('modal', {
           //     content: 'your content HTML'
           //    });


   //   L.marker([-72.011389, 2.735]).addTo(map).bindPopup('A popup - easily customizable.').openPopup();
// }
          } //north
          //if locations exist and north is antarctic
           if ((data.feed.entries[i].hasOwnProperty('locations'))&&(data.feed.entries[i].locations.north<0)&&(mapselect===antarctica)){
             let loc = data.feed.entries[i].locations;
             console.log(loc.north, loc.south, loc.west, loc.east);
                if ((loc.north === loc.south) && (loc.east === loc.west)) {
                    var popup = L.popup().setLatLng([loc.north, loc.west]).setContent("Point").openOn(map);
                } else {
                     coverage = [[loc.north, loc.west], [loc.north, loc.east],[loc.south, loc.east], [loc.south, loc.west]];
                     L.polygon(coverage).addTo(map).bindPopup("Polygon").openPopup();
                }
          } //south





      } //loop theough entries


  }

};




module.exports = MapviewShowController;
