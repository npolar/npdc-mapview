'use strict';

// @ngInject

var router = function ($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/:id', {
    templateUrl: 'show/show.html',
    controller: 'MapviewShowController'
  }).when('/', {
    templateUrl: 'search/search.html',
    controller: 'MapviewSearchController',
    reloadOnSearch: false
  });
};

module.exports = router;
