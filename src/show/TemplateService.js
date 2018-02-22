'use strict';
//service

// @ngInject
var TemplateService = function () {
  this.modal = function (entry,doc,lat,lng) {
    let str = '';
    if (doc.target_database === "expedition/track"){

        str = str + '<div class="modal-body">'+doc.display_parameters[0].heading +': '+ entry.properties[doc.display_parameters[0].parameter][0] + '</div>';

  	   return ['<div class="modal-header"><h4>'+entry.properties[doc.display_top_heading][0] + ', start coord: ('+ lat+','+ lng +') </h4></div>',
                       '<div class="modal-header"><h2>'+entry.properties[doc.display_main_heading]+'</h2></div>',
                       '<hr>', str,'<div class="modal-footer">','</div>'].join('');
    } else { //if target_database

       for (let i=0;i<(doc.display_parameters.length);i++){
         str = str + '<div class="modal-body">'+doc.display_parameters[i].heading +': '+ entry[doc.display_parameters[i].parameter] + '</div>';
       }
       str = str + '<div class="modal-body"><a href='+ doc.display_link + entry.id + ' target="_blank">Show record</a>';

       return ['<div class="modal-header"><h4>'+entry[doc.display_top_heading]+ ' ('+ lat+','+ lng +') </h4></div>',
                      '<div class="modal-header"><h2>'+entry[doc.display_main_heading]+'</h2></div>',
                      '<hr>', str,'<div class="modal-footer">','</div>'].join('');

    }
  };
};

module.exports = TemplateService;
