'use strict';
//service

// @ngInject
var TemplateService = function () {
  this.geology = function (entry) {
  	return ['<div class="modal-header"><h4>'+entry.title+'</h4></div>',
                       '<div class="modal-header"><h2>'+entry.lithology+'</h2></div>',
                        '<hr>',
                        '<div class="modal-body">Description: '+entry.sample_description+'</div>',
                        '<div class="modal-body">Analysis: '+entry.analysis+'</div>',
                        '<div class="modal-body">Location name: '+entry['@placename']+'</div>',
                          '<div class="modal-body">Location: ['+ entry.latitude+','+entry.longitude+']</div>',
                        '<div class="modal-body">Position accuracy: '+entry.position_accuracy+'</div>',
                        '<div class="modal-body">Collected year: '+entry.collected_year+'</div>',
                        '<div class="modal-footer">',
                        '</div>'].join('')
  };
};

module.exports = TemplateService;