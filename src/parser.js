/**
 * Base parser with a few general methods
 * which suit for both html and css
 * Each specific parser extendes this one and implement specicif methods
 * @param {String} input
 */
var Parser = function(input) {
    this.pos = 0;
    this.input = input;
    this.inputLength = input.length;
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
