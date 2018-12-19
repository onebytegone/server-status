'use strict';

var jsdom = require('jsdom-global'),
    stringify = require('stringify');

jsdom();

stringify.registerWithRequire({ extensions: [ '.html' ] });
