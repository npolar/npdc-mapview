'use strict';

var MapviewShowController = function($controller, $routeParams,$scope, $q, Mapview, npdcAppConfig, NpolarApiSecurity, npolarApiConfig, MapArrayService, MapviewService) {
    'ngInject';

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = Mapview;

  //Show map in Antarctica or Svalbard
  let arctic = [78.000, 16.000];
  let antarctica = [-72.01667, 2.5333];

  //Build map
  var L = require('leaflet');
  L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';
  //Initiate map with arctic location
  var map = L.map('mapid', {
      fullscreenControl: true,
      fullscreenControlOptions: {
      position: 'topleft'
  }}).setView(antarctica, 4);

  L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}/', {
      maxZoom: 18,
      attribution: 'Esmapri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
  }).addTo(map);

  // Initialise the FeatureGroup to store editable layers
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  //Filter button
  $scope.filter = function() {
       let search_init = $scope.document.search_init;

       //Get selected map choice
       let map_id = ($scope.map_select.selectedOption.id)-1;
       let map_arr = MapArrayService.getArray(0);
       map_arr[map_id] === 'Antarctica'? map.setView(new L.LatLng(antarctica[0],antarctica[1]), 4) : map.setView(new L.LatLng(arctic[0], arctic[1]), 4);


       //Get the other choices
       let sel_id_arr = [(($scope.select0.selectedOption.id)-1), (($scope.select1.selectedOption.id)-1), (($scope.select2.selectedOption.id)-1)];

       //Go through the select menus
       for (let j = 0; j < $scope.document.select.length; j++) {

            let sel_arr = MapArrayService.getArray(j+1);

            //Add entry to select string
            let init_str = (sel_id_arr[j] !== 0 ?  ("&filter-" + $scope.document.select[j].entry + "=" + sel_arr[sel_id_arr[j]]):"");

            //Have to check especially for date since this is an interval, not year as listed in select menu
            //if yes, overwrite init_str

            if (($scope.document.select[j].entry).includes("date") && (sel_id_arr[j] !== 0)) {
                init_str = "&filter-" + $scope.document.select[j].entry + "=" + sel_arr[sel_id_arr[j]] + "-01-01T00:00:00Z.." + (parseInt(sel_arr[sel_id_arr[j]])+1).toString() + "-01-01T00:00:00Z"; }

            search_init = search_init + init_str;
       }



      //If search_init starts with &, remove it
      if (search_init.charAt(0) === '&') { search_init = search_init.substring(1); }
       console.log("search_init", search_init.toLowerCase());

       Search($scope.document,search_init.toLowerCase());

  };
  //Reset button
  $scope.reset = function() {
      let map_arr = MapArrayService.getArray(0);
      $scope.map_select.selectedOption = {id: '1', name: map_arr[0]};
      map_arr[0] === 'Antarctica'? map.setView(new L.LatLng(antarctica[0],antarctica[1]), 4) : map.setView(new L.LatLng(arctic[0], arctic[1]), 4);
  };

    //Leaflet have problems with finding the map size
    //invalidateSize checks if the map container size has changed and updates map.
    //Since map resizing is done by css, need to delay the invalidateSize check.
    setTimeout(function(){ map.invalidateSize();}, 20);


    let show = function() {


     $scope.show().$promise.then((mapview) => {


       //Create map select menu
       let map_arr=($scope.document.map).split(",");
       $scope.map_select = Select(MapArrayService.setArray(map_arr,0),0);

       //Create the other three select menus
       $scope.select0 = Select($scope.document.select[0].enum,1);
       $scope.select1 = Select($scope.document.select[1].enum,2);
       $scope.select2 = Select($scope.document.select[2].enum,3);

       Search($scope.document,$scope.document.search_init);

    });  //promise
  }; //show

  show();

  //Get the select menus running
  function Select(select_arr,count){
       //Fetch data from service
       MapArrayService.setArray(select_arr,count);

       //Push to select
       let availableOptions = [];
       for (let j = 0; j < select_arr.length; j++) {
          availableOptions.push({ id:(j+1).toString(), name:select_arr[j] });
       }

       return {
        availableOptions: availableOptions,
        selectedOption: {id: '1', name: select_arr[count][0]}
       };
  }

   //The database search call get display items
  function Search(doc,search_init){

      //Show database name as title
       let db = doc.target_database;


      //Fetch fields to search for
      let fields = "id," + doc.location +
          ',' + doc.display_main_heading +
          ',' + doc.display_top_heading;

      for (let k = 0; k < doc.display_parameters.length; k++) {
          fields = fields + ',' + doc.display_parameters[k].parameter;
      }



      //Fetch data
      let link =  npolarApiConfig.base + "/" + db +"/?q=&format=json&limit=all&"+search_init+"&fields=" + fields;
      console.log(link);

      MapviewService.getValues(link).then
        // on success
        (function(results) {
            GetCoverage(results.data,db);
        }),
        //on failure
        (function(response,status){
            console.log("The request failed with response " + response + " and status code " + status);
        }); //end getValues
  }

  // Estimate the diagram values
  function GetCoverage(data,db) {

     //console.log(data);

      //Get objects with locations, forget the rest
      let coverage;
      let len = data.feed.entries.length;

      console.log("data",data);

      //Unstandarized data for location - this need to be fixed to get efficient code!
      if (db==="geology/sample") {
           //Loop through entries
           for (let i = 0; i < len; i++) {
           if ((data.feed.entries[i].hasOwnProperty('latitude'))||(data.feed.entries[i].hasOwnProperty('longitude'))){
             let lat = data.feed.entries[i].latitude;
             let lng = data.feed.entries[i].longitude;
             L.marker([lat, lng]).addTo(map).bindPopup('A').openPopup();
             }
          } //north
      }

      //Unstandarized data for location
      if (db==="seabird-colony") {
          //loop through entries
      for (let i = 0; i < len; i++) {
          let  entry = data.feed.entries[i];
          if (entry.hasOwnProperty('geometry')){
             if (entry.geometry.type === 'Point') {
                L.marker([entry.geometry.coordinates[1], entry.geometry.coordinates[0]]).addTo(map).bindPopup('B').openPopup();
             } else if  ((entry.geometry.type==='GeometryCollection')&&(entry.geometry.geometries.type==='Point')){
                L.marker([entry.geometry.geometries.coordinates[1],entry.geometry.geometries.coordinates[0]]).addTo(map).bindPopup('B').openPopup();
             }
          } //geometry

      } //loop through entries
      } //seabird-colony

      if (db==="expedition") {
      //loop through entries
      for (let i = 0; i < len; i++) {
           //if locations exist and north is arctic
           if (data.feed.entries[i].hasOwnProperty('locations')){
             let loc = data.feed.entries[i].locations;
            // console.log(loc.north, loc.south, loc.west, loc.east);
             if (loc.hasOwnProperty('north')&&(loc.north!==null)&&(loc.south!==null)&&(loc.west!==null)&&(loc.east!==null)) {
                if ((loc.north === loc.south) && (loc.east === loc.west)) {
                    var popup = L.popup().setLatLng([loc.north, loc.west]).setContent("Point").openOn(map);
                } else {
                     coverage = [[loc.north, loc.west], [loc.north, loc.east],[loc.south, loc.east], [loc.south, loc.west]];
                      L.polygon(coverage).addTo(map).bindPopup("Polygon").openPopup();
                }
             }

           //    map.fire('modal', {
           //     content: 'your content HTML'
           //    });


   //   L.marker([-72.011389, 2.735]).addTo(map).bindPopup('A popup - easily customizable.').openPopup();
// }
          } //north

      } //loop through entries
    } //expedition

       var map_arr = MapArrayService.getArray(0);
       map_arr[0] === 'Antarctica'? map.setView(new L.LatLng(antarctica[0],antarctica[1]), 4) : map.setView(new L.LatLng(arctic[0], arctic[1]), 4);
  }

};




module.exports = MapviewShowController;
