'use strict';

var _ = require('underscore'),
    moment = require('moment'),
    template = require('./status-widget.html'),
    EventChart = require('../event-chart/EventChart'),
    INFO_ICON_MAP;

INFO_ICON_MAP = {
   ip: 'fa-server',
   reportingIP: 'fa-globe',
};

module.exports = {
   name: 'StatusWidget',
   template: template,

   components: {
      EventChart: EventChart,
   },

   props: {
      server: {
         required: true,
      },
      timestamp: {
         'default': new Date(),
      },
   },

   computed: {
      lastUpdate: function() {
         return _.chain(this.server.events).sortBy('timestamp').last().value();
      },

      infoItems: function() {
         return _.map(this.lastUpdate.payload, function(value, key) {
            return {
               icon: _.has(INFO_ICON_MAP, key) ? INFO_ICON_MAP[key] : key,
               key: key,
               value: value,
            };
         });
      },

      lastUpdateText: function() {
         var lastUpdate, diff;

         lastUpdate = moment(this.lastUpdate.timestamp);
         diff = moment.duration(lastUpdate.diff(moment(this.timestamp)));

         return diff.as('minutes') + 'm (' + lastUpdate.format() + ')';
      },
   },
};
