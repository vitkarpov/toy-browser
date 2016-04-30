var BaseParser = require('../../src/parser.js');

var Parser = function(css) {
    BaseParser.call(this, css);
}

Parser.prototype = Object.create(BaseParser.prototype);

Parser.prototype.getRules = function() {
    var rules = [];

    while (!this._eof()) {
        this.consumeWhitespaces();
        rules.push(this.getRule());
    }
    return rules;
};

Parser.prototype.getRule = function() {
    return {
        selectors: this.consumeSelectors(),
        declarations: this.consumeDeclarations()
    }
};

Parser.prototype.consumeSelectors = function() {
    var selectors = [];

    while (this._getCurrentChar() !== '{') {
        selectors.push(this.consumeSimpleSelector());
        this.consumeWhitespaces();
        assert(this._consumeCurrentChar(), ',');
        this.consumeWhitespaces();
    }

    return selectors;
};

Parser.prototype.consumeSimpleSelector = function() {
    var result = {
        ids: [],
        classes: [],
        tags: [],
        universal: false
    };

    while (this._getCurrentChar() !== ',') {
        switch (this._consumeCurrentChar()) {
            case '.':
                result.classes.push(this.consumeWord());
                break;
            case '#':
                result.ids.push(this.consumeWord());
                break;
            case '*'
                result.universal = true;
                break;
            default:
                result.tags.push(this.consumeWord());
                break;
        }
    }
    return result;
};
