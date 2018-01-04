'use strict';

var MapviewShowController = function($controller, $routeParams,$scope, $q, Mapview, npdcAppConfig, NpolarApiSecurity, npolarApiConfig, MapviewService) {
    'ngInject';

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = Mapview;


  //Show map in Antarctica
  $scope.mapOptions = {};
  //$scope.mapOptions.initcoord = [-72.011389, 2.535];


  let show = function() {


    $scope.show().$promise.then((mapview) => {

      console.log($scope);
      console.log(mapview);

       //Show database name as title
      let db = $scope.document.target_database;
      $scope.document.target_database = db.charAt(0).toUpperCase() + db.slice(1);

      //Fetch fields to search for
      let fields = "id," + $scope.document.select_parameters.parameter + "," + $scope.document.display_parameters.parameters + "," + $scope.document.display_parameters.main_heading + "," + $scope.document.display_parameters.top_heading;

      //Fetch data
      let link =  npolarApiConfig.base + "/" + db +"/?q=&format=json&fields=" + fields;


      MapviewService.getValues(link).then(
        function(results) {
            // on success
            let config = results.data;
            console.log(config);

            //Search for location

            //Display location

      }); //end getValues


      //Test object for display
      let coverage = [[[-72.011389, 2.535], [-72.011389, 2.535]],[[-73.011389, 2.635], [-73.011389, 2.735]]];


      let mapoptions = Object.assign({
        geojson: "geojson",
        coverage: coverage,
        initcoord: [-72.011389, 2.535]
      });

      $scope.mapOptions = mapoptions;

    });

  };


  show();


};


module.exports = MapviewShowController;
