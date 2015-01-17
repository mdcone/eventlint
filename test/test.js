/*global describe, it, require */
'use strict';
var eventlint = require('../lib/eventlint'),
    chai = require('chai');

chai.should();
chai.use(require('chai-things'));

describe('#lint', function () {
    it('is a function', function () {
        eventlint.lint.should.be.a('function');
    });

    it('should find events which aren\'t listened for' , function () {
        var noListener = [];

        eventlint.lint('./test/testfiles', '\.tests$', function (obj) {
            if (obj.type === 'emit') {
                noListener.push(obj.handle);
            }
        });
        noListener.should.have.length(1);
        noListener.should.contain('hasNoListener');
        noListener.should.not.contain('hasNoEmit');
        noListener.should.not.contain('hasEmit');
    });

    it('should find events which aren\'t emitted for' , function () {
        var noEmit = [];

        eventlint.lint('./test/testfiles', '\.tests$', function (obj) {
            if (obj.type === 'listen') {
                noEmit.push(obj.handle);
            }
        });
        noEmit.should.have.length(1);
        noEmit.should.contain('hasNoEmit');
        noEmit.should.not.contain('hasEmit');
        noEmit.should.not.contain('hasNoListener');
    });
});
