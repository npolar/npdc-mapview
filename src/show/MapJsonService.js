'use strict';

var MapJsonService = function() {

   //input example of several features
   var service = {};
   service.mapobjects = [];

   return {
     getJSON: function() {
       return [service];
     },
     //Setter - if del is true, remove old
     setJSON: function(places) {
        for (var i=0;i<places.length;i++) {
             (service.mapobjects).push(places[i]);
        }
        return [service];
     },
     delJSON: function(del) {

        //Find index
        var arrID;
        var max = (service.mapobjects).length;
        console.log(max);

        for (var i=0;i<max;i++) {
             console.log(service.mapobjects[i].properties);
             if ((service.mapobjects[i].properties.id) && (service.mapobjects[i].properties.id === del.toString())) {
                arrID = i;
             }
        }

        //Get object type first
        var type = service.mapobjects[parseInt(arrID)].geometry.type;

        //remove array entry
        (service.mapobjects).splice(parseInt(arrID), 1);

        //return object type
        return type;
     }
  };

};


module.exports = MapJsonService;
