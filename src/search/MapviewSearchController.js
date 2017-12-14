'use strict';
/**
 * @ngInject
 */
var MapviewSearchController = function ($filter, $scope, $location, $controller, Mapview, npdcAppConfig, NpolarTranslate) {

  $controller('NpolarBaseController', { $scope: $scope });
  $scope.resource = Mapview;

  npdcAppConfig.cardTitle = "Mapview";
  npdcAppConfig.search.local.results.subtitle = "target_database";


  let query = function() {
    let defaults = { limit: "all", sort: "-updated", fields: 'id,target_database,updated,map',
      'date-year': 'updated', facets: 'target_database,map' };
   // let invariants = $scope.security.isAuthenticated() ? {} : {"not-draft": "yes"} ;
   let invariants = {};
    return Object.assign({}, defaults, invariants);
  };

  $scope.search(query());

  $scope.$on('$locationChangeSuccess', (event, data) => {
    $scope.search(query());
  });

};

module.exports = MapviewSearchController;