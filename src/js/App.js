'use strict';

var Vue = require('vue'),
    StatusWidget = require('./components/status-widget/StatusWidget');

module.exports = Vue.extend({
   name: 'App',

   components: {
      StatusWidget: StatusWidget,
   },

   data: function() {
      return {
         servers: [],
      };
   },

   mounted: function() {
      this.fetchData();
   },

   methods: {
      fetchData: function() {
         this.servers = [
            {
               name: 'CinemaChef',
            },
            {
               name: 'OrangeResort',
            },
         ];
      },
   },
});
