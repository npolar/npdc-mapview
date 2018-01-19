'use strict';

var MapArrayService = function() {

  // array of arrays
   var obj = {map:[], select0:[], select1:[], select2:[]};

   return {
     //Getter
     getArray: function(key) {
       return obj[key];
     },
     //Setter
     setArray: function(arr,key) {
        obj[key] = arr;
        console.log("set",obj);
        return obj[key];
     }
  };

};


module.exports = MapArrayService;
