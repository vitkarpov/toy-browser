var BaseParser = require('../../src/parser.js');

var Parser = function(css) {
    BaseParser.call(this, css);
}

Parser.prototype = Object.create(BaseParser.prototype);
