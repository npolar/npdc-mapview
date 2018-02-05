'use strict';
//service

// @ngInject
var TemplateService = function () {
  this.modal = function (entry,doc,lat,lng) {
    let str = '';
    for (let i=0;i<(doc.display_parameters.length);i++){
        str = str + '<div class="modal-body">'+doc.display_parameters[i].heading +': '+ entry[doc.display_parameters[i].parameter] + '</div>';
    }
    str = str + '<div class="modal-body"><a href='+ doc.display_link + entry.id + ' target="_blank">Show record</a>';

  	return ['<div class="modal-header"><h4>'+entry[doc.display_top_heading]+ ' ('+ lat+','+ lng +') </h4></div>',
                       '<div class="modal-header"><h2>'+entry[doc.display_main_heading]+'</h2></div>',
                       '<hr>', str,'<div class="modal-footer">','</div>'].join('');
  };
};

module.exports = TemplateService;