var expect = require('chai').expect;
var Parser = require('../../src/html-parser.js');

describe('HTML Parser', function() {
    it('#consumeWhitespaces', function() {
        var input = '   ';
        var p = new Parser(input);

        expect(p.consumeWhitespaces()).to.equal(input);
    });
    it('#consumeText', function() {
        var input = 'hello, world</b>';
        var p = new Parser(input);

        expect(p.consumeText()).to.equal('hello, world');
    });
    it('#consumeTagName', function() {
        var input = 'h1';
        var p = new Parser(input);

        expect(p.consumeTagName()).to.equal(input);
    });
    it('#consumeAttrName', function() {
        var input = 'class';
        var p = new Parser(input);

        expect(p.consumeTagName()).to.equal(input);
    });
    it('#consumeAttrValue', function() {
        var input = '"foo"';
        var p = new Parser(input);

        expect(p.consumeAttrValue()).to.equal('foo');
    });
    it('#consumeAttr', function() {
        var input = 'class="foo"';
        var p = new Parser(input);

        var attr = p.consumeAttr();

        expect(attr).to.have.property('name').and.equal('class');
        expect(attr).to.have.property('value').and.equal('foo');
    });
    it('#consumeAttrs', function() {
        var input = 'class="foo" data-key="bar">';
        var p = new Parser(input);

        var attrs = p.consumeAttrs();

        expect(attrs).to.have.property('class').and.equal('foo');
        expect(attrs).to.have.property('data-key').and.equal('bar');
    });
});
