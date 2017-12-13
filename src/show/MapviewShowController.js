'use strict';

var MapviewShowController = function($controller, $routeParams,$scope, $q, Mapview, npdcAppConfig) {
    'ngInject';

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = Mapview;


  //Show map in Antarctica
  $scope.mapOptions = {};
  $scope.mapOptions.initcoord = [-72.011389, 2.535];

};


module.exports = MapviewShowController;
