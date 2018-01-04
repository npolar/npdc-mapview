'use strict';
//service

// @ngInject

var MapviewService = function($resource, $http){

  var getValues = function(Inputlink) {
    return $http.get(Inputlink);
  };


  return {
    getValues: getValues
  };
};

module.exports = MapviewService;