#!/usr/bin/env node
'use strict';
var meow = require('meow');
var eventlint = require('./lib/eventlint');

var cli = meow({
  help: [
    'Usage',
    '  eventlint <directory> [<pattern>]',
    '',
    'Example',
    '  eventlint ./awesomeCode',
    '  eventlint ./awesomeCode \.someExtension'
  ].join('\n')
});

eventlint.lint(cli.input[0], cli.input[1], function (obj) {
    var output = obj.file + ': ';
    if (obj.type === 'emit') {
        output += 'No listener found for emitted event: ';
    } else {
        output += 'Listener found for non-existing event: ';
    }

    output += obj.handle;

    console.log(output);
});
