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
      var urlParams = new window.URLSearchParams(window.location.search),
          endpoint = urlParams.get('endpoint') || './sample-data.json';

      return {
         endpoint: endpoint,
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
         return fetch(this.endpoint, { credentials: 'include' })
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
