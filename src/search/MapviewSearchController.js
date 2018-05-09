'use strict';
/**
 * @ngInject
 */
var MapviewSearchController = function ($filter, $scope, $location, $controller, Mapview, npdcAppConfig, NpolarTranslate) {

  $controller('NpolarBaseController', { $scope: $scope });
  $scope.resource = Mapview;

  npdcAppConfig.cardTitle = "Mapview";
  npdcAppConfig.search.local.results.subtitle = "map";
  npdcAppConfig.search.local.results.title = "heading";
  npdcAppConfig.search.local.results.detail = "description";


  let query = function() {
    let defaults = { limit: "all", sort: "-updated", fields: 'id,heading,description,updated,map,draft',
      'date-year': 'updated', facets: 'heading,map' };
    let invariants = $scope.security.isAuthenticated() ? {} : {"not-draft": "yes"} ;
    return Object.assign({}, defaults, invariants);
  };

  $scope.search(query());

  $scope.$on('$locationChangeSuccess', (event, data) => {
    $scope.search(query());
  });

};

module.exports = MapviewSearchController;
