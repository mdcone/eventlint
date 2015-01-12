/*global describe, it */
'use strict';
var assert = require('assert');
var eventlint = require('../');

describe('eventlint node module', function () {
  it('must have at least one test', function () {
    eventlint();
    assert(false, 'I was too lazy to write any tests. Shame on me.');
  });
});
