var expect = require('chai').expect;
var Parser = require('../../src/css.js');

describe('HTML Parser', function() {
    describe('#consumeSelector', function() {
        ([
            { input: '.foo,', expected: {
                classes: ['foo'],
                id: null,
                tag: null
            } },
            { input: '.foo.bar', expected: {
                classes: ['foo', 'bar'],
                id: null,
                tag: null
            } },
            { input: '#foo ', expected: {
                classes: [],
                id: 'foo',
                tag: null
            } },
            { input: '#foo.bar,', expected: {
                classes: ['bar'],
                id: 'foo',
                tag: null
            } },
            { input: 'h1.foo, ', expected: {
                classes: ['foo'],
                id: null,
                tag: 'h1'
            } },
            { input: 'h1#foo.bar.baz, ', expected: {
                classes: ['bar', 'baz'],
                id: 'foo',
                tag: 'h1'
            } },
        ]).forEach(function(test) {
            it('consumes "' + test.input + '" and returns "' + JSON.stringify(test.expected) + '"', function() {
                var p = new Parser(test.input);
                expect(p.consumeSelector()).to.eql(test.expected);
            });
        });
    });
    describe('#consumeSelectors', function() {
        ([
            { input: '.foo, .bar { color: red; }', expected: [
                {
                    classes: ['foo'],
                    id: null,
                    tag: null
                },
                {
                    classes: ['bar'],
                    id: null,
                    tag: null
                }
            ] },
            { input: '#foo, h1.bar, .baz{ color: red; }', expected: [
                {
                    classes: [],
                    id: 'foo',
                    tag: null
                },
                {
                    classes: ['bar'],
                    id: null,
                    tag: 'h1'
                },
                {
                    classes: ['baz'],
                    id: null,
                    tag: null
                }
            ] }
        ]).forEach(function(test) {
            it('consumes "' + test.input + '" and returns "' + JSON.stringify(test.expected) + '"', function() {
                var p = new Parser(test.input);
                expect(p.consumeSelectors()).to.eql(test.expected);
            });
        });
    });
});
