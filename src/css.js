var assert = require('./assert.js');
var Specifity = require('./specifity.js');
var BaseParser = require('./parser.js');

/**
 * @typedef {object} Rule
 * @property {array} selectors
 * @property {array} declarations
 */

/**
 * @typedef {object} Selector
 * @property {string?} id
 * @property {string?} tag
 * @property {array} classes
 */

/**
 * CSS parser
 * @param {string} css
 */
var Parser = function(css) {
    BaseParser.call(this, css);
}

Parser.prototype = Object.create(BaseParser.prototype);

/**
 * Parses all the file and
 * returns an array of rules
 * @return {Rule[]}
 */
Parser.prototype.getRules = function() {
    var rules = [];

    while (!this._eof()) {
        this.consumeWhitespaces();
        rules.push(this.getRule());
    }
    return rules;
};

/**
 * Returns a single rule
 * @return {Rule}
 */
Parser.prototype.getRule = function() {
    return {
        selectors: this.consumeSelectors(),
        declarations: this.consumeDeclarations()
    }
};

/**
 * Consumes a set of selectors for the rule, e.g
 * .foo, .bar, #baz { color: red; }
 * @return {array}
 */
Parser.prototype.consumeSelectors = function() {
    var selectors = [];

    while (true) {
        selectors.push(this.consumeSelector());
        this.consumeWhitespaces();
        if (this._getCurrentChar() === '{') {
            break;
        }
        assert(this._consumeCurrentChar(), ',');
        this.consumeWhitespaces();
    }

    return this.sortAccordingSpecifity(selectors);
};

/**
 * Consumes one selector,
 * currently supported only simple one, e.g.:
 * - .foo.bar
 * - #foo.bar
 * - h1.foo
 * @return {Selector}
 */
Parser.prototype.consumeSelector = function() {
    /**
     * @type {Selector}
     */
    var result = {
        tag: null,
        id: null,
        classes: []
    };

    while (!this._end() && [' ', '{', ','].indexOf(this._getCurrentChar()) === -1) {
        switch (this._getCurrentChar()) {
            case '.':
                this._consumeCurrentChar();
                result.classes.push(this.consumeWord());
                break;
            case '#':
                this._consumeCurrentChar();
                result.id = this.consumeWord();
                break;
            default:
                result.tag = this.consumeWord();
                break;
        }
    }
    return result;
};

/**
 * Sorting selectors according their specifity.
 * @returns {array}
 */
Parser.prototype.sortAccordingSpecifity = function(selectors) {
    return selectors.sort(function(current, next) {
        var specifityCurrent = new Specifity(current);
        var specifityNext = new Specifity(next);

        return specifityNext - specifityCurrent;
    });
};

module.exports = Parser;
