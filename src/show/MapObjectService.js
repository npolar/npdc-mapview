'use strict';

var MapObjectService = function() {

   //input example of several features
  // var service = {};
   var maparr = [];

   return {
     getMapObject: function() {
       return maparr;
     },
     //Setter - if del is true, remove old
     setMapObject: function(arr) {
        maparr = arr;
        return maparr;
     }
  };

};


module.exports = MapObjectService;
