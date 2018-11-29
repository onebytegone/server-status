'use strict';

var template = require('./status-widget.html');

module.exports = {
   name: 'StatusWidget',
   template: template,

   props: {
      server: {
         required: true,
      },
   },
};
