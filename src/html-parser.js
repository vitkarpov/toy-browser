var Node = require('./node.js');
var assert = require('./assert.js');

/**
 * Recursively parses html and returns DOM
 * @param  {string} html
 * @return {object}
 */
var Parser = function(html) {
    this.pos = 0;
    this.input = html;
    this.inputLength = html.length;
};

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
    var result = [];
    var next;

    while (true) {
        this.consumeWhitespaces();
        if (this._end() || this._startsWith('</')) {
            break;
        }
        result.push(this.getNode());
    }
    return result;
};

/**
 * Recursively parses single html element and returns a node
 * @param  {string} input
 * @return {object}
 */
Parser.prototype.getNode = function() {
    var ch = this._getCurrentChar();

    if (ch === '<') {
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

    var tag = this.consumeTagName();
    var attrs = this.consumeAttrs();

    var children = this.getNode();

    assert(this._consumeCurrentChar(), '<');
    assert(this._consumeCurrentChar(), '/');
    assert(this.consumeTagName(), tag);
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
 * Consumes one or more whitespaces (also tabs, line feed and etc.) in a row
 * @return {string}
 */
Parser.prototype.consumeWhitespaces = function() {
    return this._consume(function(ch) {
        return /\s/.test(ch);
    });
};

/**
 * Consumes a tag name
 * @return {string}
 */
Parser.prototype.consumeTagName = function() {
    return this._consume(function(ch) {
        return /\w|\d/.test(ch);
    });
};

/**
 * Consumes an attribute name
 * @return {string}
 */
Parser.prototype.consumeAttrName = function() {
    return this._consume(function(ch) {
        return /\w|\d|-/.test(ch);
    });
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
    var name = this.consumeAttrName();
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

/**
 * Consumes only appropriate characters from input
 * @param {Function} isCharFits callback tests a char somehow
 * @return {string}
 */
Parser.prototype._consume = function(isCharFits) {
    var result = '';

    while (!this._end() && isCharFits(this._getCurrentChar())) {
        result += this._consumeCurrentChar();
    }
    return result;
};

/**
 * Is the current input starts from the specified char
 * @param  {string} ch
 * @return {boolean}
 */
Parser.prototype._startsWith = function(ch) {
    return new RegExp('^' + ch).test(this.input[this.pos]);
};

/**
 * Checkes have we consumed all the input
 * @private
 * @return {boolean}
 */
Parser.prototype._end = function() {
    return this.pos >= this.inputLength;
};

/**
 * Returns the current char without consuming it
 * @private
 * @return {string}
 */
Parser.prototype._getCurrentChar = function() {
    return this.input[this.pos];
};

/**
 * Returns the current char and increases the counter
 * @private
 * @return {string}
 */
Parser.prototype._consumeCurrentChar = function() {
    return this.input[this.pos++];
};

module.exports = Parser;
