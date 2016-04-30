var expect = require('chai').expect;
var Parser = require('../../src/parser.js');

describe('Base Parser', function() {
    ([
        { method: 'consumeWhitespaces', tests: [
            { input: '   ', expected: '   ' },
            { input: '  foo', expected: '  ' }
        ] },
        { method: 'consumeWord', tests: [
            { input: 'h1', expected: 'h1' },
            { input: 'b', expected: 'b' },
            { input: 'html', expected: 'html' },
            { input: 'hello-my-block', expected: 'hello-my-block' }
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
