'use strict';

var MapviewShowController = function($controller, $routeParams,$scope, $q, Mapview, npdcAppConfig, NpolarApiSecurity, npolarApiConfig, MapviewService, MapJsonService) {
    'ngInject';

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = Mapview;


  //Show map in Antarctica
  $scope.mapOptions = {};

  let the_arctic = [78.000, 16.000];
  let antarctica = [-72.01667, 2.5333];
  //use map from Arctic or Antarctic
  let mapselect = antarctica;


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

     //Leaflet have problems with finding the map size
    //invalidateSize checks if the map container size has changed and updates map.
    //Since map resizing is done by css, need to delay the invalidateSize check.
    setTimeout(function(){ map.invalidateSize()}, 20);



   let show = function() {


    $scope.show().$promise.then((mapview) => {

       //Show database name as title
      let db = $scope.document.target_database;
      $scope.document.target_database = db.charAt(0).toUpperCase() + db.slice(1);

      //Fetch fields to search for
      let fields = "id," + $scope.document.select_parameters.parameter + "," + $scope.document.display_parameters.parameters + "," + $scope.document.display_parameters.main_heading + "," + $scope.document.display_parameters.top_heading;

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

        console.log($scope);

  });  //promise
  }; //show

  show();

  // Estimate the diagram values
function GetCoverage(data) {

      //Test object for display
      let coverage = [[-72.011389, 2.535], [-72.011389, 2.535],[-73.011389, 2.635], [-73.011389, 2.735]];

      L.polygon(coverage).addTo(map).bindPopup("Polygon.").openPopup();

      L.marker([-72.011389, 2.735]).addTo(map).bindPopup('A popup - easily customizable.').openPopup();

      //return null;
}

};




module.exports = MapviewShowController;
