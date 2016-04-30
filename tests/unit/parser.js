var expect = require('chai').expect;
var Parser = require('../../src/parser.js');

describe('Base Parser', function() {
    ([
        { method: 'consumeWhitespaces', tests: [
            { input: '   ', expected: '   ' },
            { input: '  foo', expected: '  ' }
        ] }
    ]).forEach(function(item) {
        describe('#' + item.method, function() {
            item.tests.forEach(function(test) {
                it('consumes "' + test.input + '" and returns "' + test.expected + '"', function() {
                    var p = new Parser(test.input);
                    expect(p[item.method]()).to.equal(test.expected);
                });
            });
        });
    });
});
