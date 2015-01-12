#!/usr/bin/env node
'use strict';
var meow = require('meow');
var eventlint = require('./');

var cli = meow({
  help: [
    'Usage',
    '  eventlint <input>',
    '',
    'Example',
    '  eventlint Unicorn'
  ].join('\n')
});

eventlint(cli.input[0]);
