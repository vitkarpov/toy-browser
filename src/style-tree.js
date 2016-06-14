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
    return this.getRulesForNode(node).reduce(function(styles, rule) {
        rule.declarations.forEach(function(decl) {
            Object.keys(decl).forEach(function(key) {
                styles[key] = decl[key];
            });
        });
        return styles;
    }, {});
};

/**
 * Find rules for the node according existing selectors in CSSOM
 * @param  {Node} node
 * @return {Rule[]}
 */
StyleTree.prototype.getRulesForNode = function(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        return [];
    }
    var nodeClasses = node.data.attrs['class'];
    var nodeId = node.data.attrs.id;
    var nodeTag = node.data.tag;

    return this.rules.filter(function(rule) {

        return rule.selectors.some(function(selector) {
            return (
                nodeClasses && selector.classes.some(function(className) {
                    return nodeClasses.indexOf(className) > -1;
                }) ||
                selector.id === nodeId ||
                selector.tag === nodeTag
            );
        });
    });
};

module.exports = StyleTree;
