'use strict';

var MapviewShowController = function($controller, $routeParams,$scope, $q, Mapview, npdcAppConfig, NpolarApiSecurity) {
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

      let coverage = [[[-72.011389, 2.535], [-72.011389, 2.535]]];


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
