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
Parser.prototype.parse = function() {
    var rules = [];

    while (!this._end()) {
        this.consumeWhitespaces();
        rules.push(this.getRule());
        this.consumeWhitespaces();
    }
    return rules;
};

/**
 * Returns a single rule
 * @return {Rule}
 */
Parser.prototype.getRule = function() {
    var rule = {};

    rule.selectors = this.consumeSelectors();
    assert(this._consumeCurrentChar(), '{');
    rule.declarations = this.consumeDeclarations();
    assert(this._consumeCurrentChar(), '}');

    return rule;
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
    var selector = {
        tag: null,
        id: null,
        classes: []
    };

    while ([' ', '{', ','].indexOf(this._getCurrentChar()) === -1) {
        switch (this._getCurrentChar()) {
            case '.':
                this._consumeCurrentChar();
                selector.classes.push(this.consumeWord());
                break;
            case '#':
                this._consumeCurrentChar();
                selector.id = this.consumeWord();
                break;
            default:
                selector.tag = this.consumeWord();
                break;
        }
    }
    return selector;
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

/**
 * Consumes a set of declarations inside {}
 * @return {array}
 */
Parser.prototype.consumeDeclarations = function() {
    var declarations = [];

    while (this._getCurrentChar() !== '}') {
        declarations.push(this.consumeDeclaration());

        this.consumeWhitespaces();
        assert(this._consumeCurrentChar(), ';');
        this.consumeWhitespaces();
    }
    return declarations;
};

/**
 * Consumes a singe declaration and returns hash,
 * e.g. color: red; -> { "color": "red" }
 * @return {object}
 */
Parser.prototype.consumeDeclaration = function() {
    var declaration = {};
    var prop;
    var value;

    while (this._getCurrentChar() !== ';') {
        this.consumeWhitespaces();
        prop = this.consumeWord();
        this.consumeWhitespaces();

        assert(this._consumeCurrentChar(), ':');

        this.consumeWhitespaces();
        value = this._consumeValue();
        this.consumeWhitespaces();

        declaration[prop] = value;
    }
    return declaration;
};

/**
 * Consumes a value in declaration
 * @private
 * @return {string}
 */
Parser.prototype._consumeValue = function() {
    return this._consume(function(ch) {
        return /[^;]/.test(ch);
    });
};

module.exports = Parser;
