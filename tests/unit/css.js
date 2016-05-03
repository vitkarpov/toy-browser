var expect = require('chai').expect;
var Parser = require('../../src/css.js');

describe('HTML Parser', function() {
    describe('#consumeSelector', function() {
        ([
            { input: '.foo { color: red; }', expected: {
                classes: ['foo'],
                id: null,
                tag: null
            } },
            { input: '.foo.bar { color: red; }', expected: {
                classes: ['foo', 'bar'],
                id: null,
                tag: null
            } },
            { input: '#foo { color: red; }', expected: {
                classes: [],
                id: 'foo',
                tag: null
            } },
            { input: '#foo.bar { color: red; }', expected: {
                classes: ['bar'],
                id: 'foo',
                tag: null
            } },
            { input: 'h1.foo, h2.bar { color: red; }', expected: {
                classes: ['foo'],
                id: null,
                tag: 'h1'
            } },
            { input: 'h1#foo.bar.baz , .poop { color: red; }', expected: {
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
            ] },
            { input: '.foo, h1.foo, #bar { color: red; }', expected: [
                {
                    classes: [],
                    id: 'bar',
                    tag: null
                },
                {
                    classes: ['foo'],
                    id: null,
                    tag: 'h1'
                },
                {
                    classes: ['foo'],
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
    describe('#consumeDeclaration', function() {
        ([
            { input: 'color: red; }', expected: { color: 'red' } },
            { input: 'background: url("foo.jpg"); }', expected: { background: 'url("foo.jpg")' } },
            { input: 'white-space: nowrap; }', expected: { 'white-space': 'nowrap' } },
            { input: 'color: #000; }', expected: { color: '#000' } }
        ]).forEach(function(test) {
            it('consumes "' + test.input + '" and returns "' + JSON.stringify(test.expected) + '"', function() {
                var p = new Parser(test.input);
                expect(p.consumeDeclaration()).to.eql(test.expected);
            });
        });
    });
    describe('#consumeDeclarations', function() {
        ([
            { input: 'background: #000; color: red; }', expected: [
                { background: '#000' },
                { color: 'red' }
            ] },
            { input: 'background: url("foo.jpg"); padding: 20px; margin: 20px 10px; }', expected: [
                { background: 'url("foo.jpg")' },
                { padding: '20px' },
                { margin: '20px 10px' },
            ] }
        ]).forEach(function(test) {
            it('consumes "' + test.input + '" and returns "' + JSON.stringify(test.expected) + '"', function() {
                var p = new Parser(test.input);
                expect(p.consumeDeclarations()).to.eql(test.expected);
            });
        });
    });
});
