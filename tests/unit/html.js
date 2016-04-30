var expect = require('chai').expect;
var Parser = require('../../src/html.js');

describe('HTML Parser', function() {
    describe('#consumeText', function() {
        ([
            { input: 'hello, world', expected: 'hello, world' },
            { input: '   fooo    bar</h1>', expected: '   fooo    bar' },
            { input: '1111!!!!&&**$$$FR#</h1>', expected: '1111!!!!&&**$$$FR#' }
        ]).forEach(function(test) {
            it('consumes "' + test.input + '" and returns "' + test.expected + '"', function() {
                var p = new Parser(test.input);
                expect(p.consumeText()).to.equal(test.expected);
            });
        });
    });
    describe('#consumeAttr', function() {
        it('consumes single attr and return ab object with its name and value', function() {
            var input = 'class="foo"';
            var p = new Parser(input);

            var attr = p.consumeAttr();

            expect(attr).to.have.property('name').and.equal('class');
            expect(attr).to.have.property('value').and.equal('foo');
        });
    });
    describe('#consumeAttrs', function() {
        it('consumes multiple attrs and returns hash map with names and values', function() {
            var input = 'class="foo" data-key="bar">';
            var p = new Parser(input);

            var attrs = p.consumeAttrs();

            expect(attrs).to.have.property('class').and.equal('foo');
            expect(attrs).to.have.property('data-key').and.equal('bar');
        });
    });
});
