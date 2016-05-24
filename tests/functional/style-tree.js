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
    'h1 { color: red; }',
    'h1.bar { color: blue; }'
].join('');

describe('Style Tree', function() {
    beforeEach(function() {
        var dom = new HtmlParser(html).parse();
        var rules = new CssParser(css).parse();

        this.styleTree = new StyleTree(dom, rules);
    });

    it('should foo', function() {
        console.log(this.styleTree.build());
    });
})
