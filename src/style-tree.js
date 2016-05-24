var Node = require('./node.js');

/**
 * @typedef {Object} StyleTreeNode
 * @property {Node} node
 * @property {Object} styles
 * @property {StyleTreeNode|StyleTreeNode[]} children
 */

/**
 * Creates a new style tree using DOM and css rules
 * @constructor
 * @param {Node}   dom   root node, usually html
 * @param {Rule[]} rules
 */
var StyleTree = function(dom, rules) {
    this.dom = dom;
    this.rules = rules;
};

/**
 * Recursively build a style tree:
 * traversing DOM and matching rules to each node
 * @param  {Node|Node[]} node
 * @return {StyleTreeNode}
 */
StyleTree.prototype.build = function(nodes) {
    return (nodes || [this.dom]).map(function(node) {
        if (node instanceof Node) {
            return {
                node: node,
                styles: this.getStylesForNode(node),
                children: this.build(node.children)
            };
        }
        return {
            node: node,
            styles: [],
            children: null
        };
    }, this);
};

/**
 * Traverses all the rules to find styles for node.
 * Uses rules' specifity to define the final set.
 * @param  {Node} node
 * @return {Object}
 */
StyleTree.prototype.getStylesForNode = function(node) {
    var styles = {};
    var rules = this.getRulesForNode(node);
};

StyleTree.prototype.getRulesForNode = function(node) {
    return [];
};

module.exports = StyleTree;
