'use strict';

var MapviewShowController = function($controller, $routeParams,$scope, $q, Mapview, npdcAppConfig, NpolarApiSecurity) {
    'ngInject';

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = Mapview;

  console.log("hei");


  //Show map in Antarctica
  $scope.mapOptions = {};

  let show = function() {

  	console.log($scope);
  	console.log("vvvvvvv");

    $scope.show().$promise.then((expedition) => {


/*      if (expedition.locations) {
         let bounds = (expedition.locations).map((locations) => [[locations.south, locations.west], [locations.north, locations.east]]);
         $scope.mapOptions.coverage = bounds;
         $scope.mapOptions.geojson = "geojson";
      }

      var pi = [];
       //Convert from camelCase to human readable
      for(var a=0; a<($scope.document.people).length; a++){
            if ($scope.document.people[a].role === 'expedition/cruise leader'){
                             pi.push($scope.document.people[a]);

      }}
      $scope.pi = pi;

      //Convert from camelCase to human readable
      for(var j=0; j<($scope.document.activity).length; j++){
         $scope.document.activity[j].activity_type = convert($scope.document.activity[j].activity_type);
      }

      //Convert from camelCase to human readable
      for(var i=0; i<($scope.document.people).length; i++){
      	 for(var k=0; k<($scope.document.people[i].roles).length; k++){
         $scope.document.people[i].roles[k] = convert($scope.document.people[i].roles[k]);
      }}  */

    });

  };


  show();


};


module.exports = MapviewShowController;
