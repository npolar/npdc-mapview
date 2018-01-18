'use strict';
//var environment = require('../environment');
var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

var angular = require('angular');
require('npdc-common/src/wrappers/leaflet');
require('leaflet-modal');


var npdcMapviewApp = angular.module('npdcMapviewApp', ['npdcCommon','leaflet']);

npdcMapviewApp.controller('MapviewShowController', require('./show/MapviewShowController'));
npdcMapviewApp.controller('MapviewSearchController', require('./search/MapviewSearchController'));
npdcMapviewApp.factory('Mapview', require('./Mapview.js'));
npdcMapviewApp.factory('MapviewService', require('./show/MapviewService.js'));
npdcMapviewApp.factory('MapObjectService', require('./show/MapObjectService.js'));





// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/', 'resource': 'NpolarApi'},
  {'path': '/user', 'resource': 'User'},
   {'path': '/mapview', 'resource': 'Mapview'}
];



resources.forEach(service => {
  // Expressive DI syntax is needed here
  npdcMapviewApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});


// Routing
npdcMapviewApp.config(require('./router'));


npdcMapviewApp.config(($httpProvider, npolarApiConfig) => {
  //var autoconfig = new AutoConfig("development");
  //angular.extend(npolarApiConfig, autoconfig, { resources });
  npolarApiConfig.base = "https://api-test.data.npolar.no";
  npolarApiConfig.environment = "development";
  console.debug("npolarApiConfig", npolarApiConfig);

  $httpProvider.interceptors.push('npolarApiInterceptor');
});

npdcMapviewApp.run(($http, npdcAppConfig, NpolarTranslate, NpolarLang) => {
  NpolarTranslate.loadBundles('npdc-mapview');
  npdcAppConfig.toolbarTitle = 'Mapview';
});


