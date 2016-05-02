/**
 * CSS selector specifity calculator
 * @constructor
 * @param {Selector} selector
 */
var Specifity = function(selector) {
    this.selector = selector;
    this.value = this.calcSpecifity();
};

/**
 * Returns specifity according w3c algorithm
 * @see https://www.w3.org/TR/selectors/#specificity
 * @return {Number}
 */
Specifity.prototype.calcSpecifity = function() {
    var a = (this.selector.id) ? 1 : 0;
    var b = this.selector.classes.length;
    var c = (this.selector.tag) ? 1 : 0;

    return 100 * a + 10 * b + c;
};

/**
 * Custom casting of the object to number:
 * returns the value of specifity
 * @return {Number}
 */
Specifity.prototype.valueOf = function() {
    return this.value;
};

module.exports = Specifity;
