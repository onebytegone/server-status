'use strict';

var expect = require('expect.js'),
    rewire = require('rewire'),
    App = rewire('../src/js/App.js');

describe('App', function() {
   var revert;

   beforeEach(function() {
      revert = App.__set__({});
   });

   afterEach(function() {
      revert();
   });

   it('is a class', function() {
      expect(App).to.be.a('function');
      expect(new App()).to.be.an('object');
   });

});
