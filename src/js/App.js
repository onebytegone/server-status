'use strict';

var Vue = require('vue'),
    moment = require('moment'),
    StatusWidget = require('./components/status-widget/StatusWidget');

module.exports = Vue.extend({
   name: 'App',

   components: {
      StatusWidget: StatusWidget,
   },

   data: function() {
      return {
         endpoint: './sample-data.json',
         servers: [],
         timestamp: '0000-00-00 00:00:00',
      };
   },

   mounted: function() {
      this.fetchData();
      setInterval(function() {
         this.fetchData();
      }.bind(this), 60 * 1000);
   },

   computed: {
      timestampText: function() {
         return moment(this.timestamp).format();
      },
   },

   methods: {
      fetchData: function() {
         return fetch(this.endpoint)
            .then(function(resp) {
               return resp.json();
            })
            .then(function(data) {
               this.servers = data.servers;
               this.timestamp = moment(data.timestamp);
            }.bind(this));
      },
   },
});
