var Node = require('./node.js');
var assert = require('./assert.js');
var BaseParser = require('./parser.js');

/**
 * HTML parser
 * @constructor
 * @param  {string} html
 */
var Parser = function(html) {
    BaseParser.call(this, html);
};

Parser.prototype = Object.create(BaseParser.prototype);

/**
 * Parses all the html and returns the root node
 * @return {Node}
 */
Parser.prototype.parse = function() {
    var nodes = this.getNodes();

    if (nodes.length === 1) {
        return nodes[0];
    }
    return new Node(Node.ELEMENT_NODE, {
        tag: 'html'
    }, nodes);
};

/**
 * Recursively parses siblings of html elements
 * and returns node list
 * @return {array}
 */
Parser.prototype.getNodes = function() {
    var nodes = [];
    var next;

    while (!this._end() && !this._startsWith('</')) {
        this.consumeWhitespaces();
        nodes.push(this.getNode());
    }
    return nodes;
};

/**
 * Recursively parses single html element and returns a node
 * @param  {string} input
 * @return {object}
 */
Parser.prototype.getNode = function() {
    if (this._getCurrentChar() === '<') {
        return this.getElementNode();
    }
    return this.getTextNode();
};

/**
 * Returns new element node from input
 * @return {Node}
 */
Parser.prototype.getElementNode = function() {
    assert(this._consumeCurrentChar(), '<');

    var tag = this.consumeWord();
    var attrs = this.consumeAttrs();

    assert(this._consumeCurrentChar(), '>');

    var children = this.getNode();

    assert(this._consumeCurrentChar(), '<');
    assert(this._consumeCurrentChar(), '/');
    assert(this.consumeWord(), tag);
    assert(this._consumeCurrentChar(), '>');

    return new Node(Node.ELEMENT_NODE, {
        tag: tag,
        attrs: attrs
    }, children);
};

/**
 * Returns new text node from input
 * @return {Node}
 */
Parser.prototype.getTextNode = function() {
    return new Node(Node.TEXT_NODE, null, this.consumeText());
};

/**
 * Consumes text inside a tag
 * @return {string}
 */
Parser.prototype.consumeText = function() {
    return this._consume(function(ch) {
        return ch !== '<';
    });
};

/**
 * Consumes a set of attrs
 * @return {array}
 */
Parser.prototype.consumeAttrs = function() {
    var result = {};

    while (true) {
        this.consumeWhitespaces();
        if (this._getCurrentChar() === '>') {
            break;
        }
        var attr = this.consumeAttr();
        result[attr.name] = attr.value;
    }
    return result;
};

/**
 * Consumes single attribute pair name="value"
 * @return {object}
 */
Parser.prototype.consumeAttr = function() {
    var name = this.consumeWord();
    assert(this._consumeCurrentChar(), '=');
    var value = this.consumeAttrValue();

    return {
        name: name,
        value: value
    };
};

/**
 * Consumes attr value
 * @return {string}
 */
Parser.prototype.consumeAttrValue = function() {
    var QUOTE = '"';
    assert(this._consumeCurrentChar(), QUOTE);
    var value = this._consume(function(ch) {
        return ch !== QUOTE;
    });
    assert(this._consumeCurrentChar(), QUOTE);
    return value;
};

module.exports = Parser;
