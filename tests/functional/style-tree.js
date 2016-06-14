var expect = require('chai').expect;
var HtmlParser = require('../../src/html.js');
var CssParser = require('../../src/css.js');
var StyleTree = require('../../src/style-tree.js');

var html = [
    '<html>',
        '<body class="foo">',
            '<h1 data-foo="bar">hello!</h1>',
            '<p>world</p>',
        '</body>',
    '</html>'
].join('');

var css = [
    'body { background: red; }',
    '.foo { color: green; }',
    'h1 { background: red; color: red; }',
    'h1.bar { color: blue; }'
].join('');

describe('Style Tree', function() {
    beforeEach(function() {
        var dom = new HtmlParser(html).parse();
        var rules = new CssParser(css).parse();

        this.styleTree = new StyleTree(dom, rules).build();
    });

    describe('body node ->', function() {
        beforeEach(function() {
            this.body = this.styleTree[0].children[0];
        });
        it('should have "background: red; color: green;" styles', function() {
            expect(this.body.styles).to.be.eql({ background: 'red', color: 'green' });
        });

        describe('h1 node ->', function() {
            beforeEach(function() {
                this.h1 = this.body.children[0];
            });
            it('should return "background:red; color: blue;" styles', function() {
                expect(this.h1.styles).to.be.eql({ background: 'red', color: 'blue' });
            });
        });
    });
})
