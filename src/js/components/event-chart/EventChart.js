'use strict';

var _ = require('underscore'),
    moment = require('moment'),
    template = require('./event-chart.html');

module.exports = {
   name: 'EventChart',
   template: template,

   props: {
      events: {
         required: true,
      },
      timestamp: {
         'default': new Date(),
      },
   },

   computed: {
      eventTimeslices: function() {
         var now = moment(this.timestamp);

         return _.map(_.range(0, 24), function(hrsAgo) {
            return _.chain(this.events)
               .filter(function(event) {
                  return moment(event.timestamp).isBetween(
                     now.clone().subtract(hrsAgo + 1, 'hours'),
                     now.clone().subtract(hrsAgo, 'hours'),
                     '(]'
                  );
               })
               .sortBy('timestamp')
               .value();
         }.bind(this));
      },
   },
};
