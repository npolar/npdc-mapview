'use strict';

var MapviewShowController = function($controller, $routeParams,$scope, $q, Mapview, npdcAppConfig, NpolarApiSecurity, npolarApiConfig, MapArrayService, MapviewService,TemplateService) {
    'ngInject';

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = Mapview;

  //Show map in Antarctica or Svalbard
  let arctic = [78.000, 16.000];
  let antarctica = [-72.01667, 2.5333];

  //Build map
  let L = require('../../node_modules/leaflet');

  L.Icon.Default.imagePath = '../assets/images/';
  require('leaflet-modal');
  require('leaflet.markercluster');

  //Initiate map with arctic location
  var map = L.map('mapid', {
      fullscreenControl: true,
      fullscreenControlOptions: {
      position: 'topleft'
  }}).setView(arctic, 4);

  L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}/', {
      maxZoom: 18,
      attribution: 'Esmapri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
  }).addTo(map);

  // Initialise the FeatureGroup to store editable layers
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  //define layer of markers
  let markersLayer = {};
  //define layer for tracks
  let geoLayer = {};

  //Filter button
  $scope.filter = function() {
       let search_init = $scope.document.search_init;

       //Get selected map choice
       let map_id = ($scope.map_select.selectedOption.id)-1;
       let map_arr = MapArrayService.getArray(0);

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
              search_init = search_init + init_str.replace(/ /g,"+");
       }

      //If search_init starts with &, remove it
      if (search_init.charAt(0) === '&') { search_init = search_init.substring(1); }

      console.log("search_init", search_init);
      Search($scope.document,search_init,map_arr[map_id]);

  };
  //Reset button
  $scope.reset = function() {
      let map_arr = MapArrayService.getArray(0);
      $scope.map_select.selectedOption = {id: '1', name: map_arr[0]};
      $scope.select0.selectedOption = {id: '1', name: MapArrayService.getArray(1)[0]};
      $scope.select1.selectedOption = {id: '1', name: MapArrayService.getArray(1)[1]};
      $scope.select2.selectedOption = {id: '1', name: MapArrayService.getArray(1)[2]};
      let search_init = $scope.document.search_init;
      Search($scope.document,search_init,map_arr[0]);
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

       Search($scope.document,$scope.document.search_init,map_arr[0]);

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
      //  selectedOption: {id: '1', name: select_arr[count][0]}
          selectedOption: {id: '1', name: MapArrayService.getArray(count)[0] }
       };
  }

  //The database search call get display items
  function Search(doc,search_init,mapval){

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
      let link =  npolarApiConfig.base + "/" + db +"/?q=&limit=all&"+search_init+"&fields=" + fields;
      console.log("link", link);

      MapviewService.getValues(link).then
        // on success
        (function(results) {
            GetCoverage(results.data,doc,mapval);
        }),
        //on failure
        (function(response,status){
            console.log("The request failed with response " + response + " and status code " + status);
        }); //end getValues
  }

   // Estimate the diagram values
  function GetCoverage(data,doc,mapval) {

      //Get objects with locations, forget the rest
      let marker = {};


      //remove old markers
      map.removeLayer(markersLayer); // remove
      map.removeLayer(geoLayer); // remove

      var markers = L.markerClusterGroup();

      //modal
      function finish(marker, map, entry,doc){

                //Transfer lat, lng for display.
                let lat = 0;
                let lng = 0;
                //Polygon, select first coord
                if (marker.hasOwnProperty('_latlngs')) {
                   lat = marker._latlngs[0][0].lat;
                   lng = marker._latlngs[0][0].lng;
                } else {  //point
                   lat = marker._latlng.lat;
                   lng = marker._latlng.lng;
                }

                //Hover over to see title
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                        this.closePopup();
                });

                marker.on('click', function (e) {
                    map.fire('modal', {
                    template:  TemplateService.modal(entry,doc,Number(lat).toFixed(4),Number(lng).toFixed(4)),
                    width: 300
                    });
                })
                //Add markercluster
                markersLayer  = markers.addLayer(marker);
                map.addLayer(markers);
       }


      //Unstandarized data for location - this need to be fixed to get efficient code!
      if (doc.target_database==="geology/sample") {

           //Loop through entries
            let j = 0;
            let len = data.feed.entries.length;
           for (let i = 0; i < len; i++) {
              let entry =  data.feed.entries[i];

           if ((entry.hasOwnProperty('latitude'))||(entry.hasOwnProperty('longitude'))){
                j = j+1;
                //Add marker
               // marker =  L.marker([entry.latitude, entry.longitude]).bindPopup(entry.title);
               marker =  L.marker([entry.latitude, entry.longitude]).bindPopup(entry[doc.display_main_heading]);
                finish(marker,map,entry,doc);
           }
          } //north
      }

      if (doc.target_database==="polar-bear/incident") {

           //Loop through entries
            let j = 0;
            let len = data.feed.entries.length;
           for (let i = 0; i < len; i++) {
              let entry =  data.feed.entries[i];
              let loc = entry.location;

           if ((loc.hasOwnProperty('latitude'))||(loc.hasOwnProperty('longitude'))){
                j = j+1;
                //Add marker
               // marker =  L.marker([entry.latitude, entry.longitude]).bindPopup(entry.title);
               marker =  L.marker([loc.latitude, loc.longitude]).bindPopup(entry[doc.display_main_heading]);
                finish(marker,map,entry,doc);
           }
          } //north
      }

      //Track database
      if (doc.target_database==="expedition/track") {
        //console.log("data track full:", data.features[0]);


          //Get search string
          geoLayer = L.geoJson(data, {
              style: {
                  color: '#ff0000',
                  weight: 1,
                  opacity: 1
              }
          }).addTo(map);

          let coord_start =  data.features[0].geometry.coordinates[0];
          //if previous marker exists
          let marker =  L.marker([coord_start[1], coord_start[0]]).bindPopup(data.features[0].properties.code);
          //  marker.addTo(map);

          finish(marker,map,data.features[0],doc);

      }


      //Unstandarized data for location
      if (doc.target_database==="seabird-colony") {
          //loop through entries

           let len = data.feed.entries.length;
           let k = 0;
      for (let i = 0; i < len; i++) {
          let  entry = data.feed.entries[i];

          if (entry.hasOwnProperty('geometry')){
             if (entry.geometry.type === 'Point') {
                marker =  L.marker([entry.geometry.coordinates[1], entry.geometry.coordinates[0]]).bindPopup(entry[doc.display_main_heading]);
                k = k+1;
                finish(marker,map,entry,doc);
             } else if  ((entry.geometry.geometries)&&(entry.geometry.geometries[0].type==='Point')){
                marker =  L.marker([entry.geometry.geometries[0].coordinates[1],entry.geometry.geometries[0].coordinates[0]]).bindPopup(entry[doc.display_main_heading]);
                k = k+1;
                finish(marker,map,entry,doc);
             }
          } //geometry


      } //loop through entries
      } //seabird-colony

      if (doc.target_database==="expedition") {
      //loop through entries


       let len = data.feed.entries.length;
       let l = 0;
       for (let i = 0; i < len; i++) {
           //if locations exist and north is arctic
           if (data.feed.entries[i].hasOwnProperty('locations')){
             let entry = data.feed.entries[i];

             for (let j = 0; j < entry.locations.length; j++) {
               let loc = entry.locations[j];
               console.log("data exp", loc);
             if (loc.hasOwnProperty('latitude')&&(loc.latitude!==null)&&(loc.longitude!==null)) {
                   marker =  L.marker([loc.latitude, loc.longitude]).bindPopup(entry[doc.display_main_heading]);
                   l = l+1;
                   finish(marker,map,entry,doc);
             }
           }

         } //latitude

      } //loop through entries


    } //expedition
    //Update map
    mapval === 'Antarctica'? map.setView(new L.LatLng(antarctica[0],antarctica[1]), 4) : map.setView(new L.LatLng(arctic[0], arctic[1]), 4);

       }

};

module.exports = MapviewShowController;
