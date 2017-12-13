'use strict';

function Mapview( $q, MapviewResource) {
  'ngInject';

//  const schema = 'http://api.npolar.no/schema/inventory';

//  InventoryResource.schema = schema;

  MapviewResource.create = function() {

      let lang = 'en';
      let collection = "mapview";
      let schema = 'http://api.npolar.no/schema/mapview';

      let e = {  lang, collection, schema };
      console.debug(e);

      return e;

    };



  return MapviewResource;



}
module.exports = Mapview;