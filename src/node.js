/**
 * @typedef {object} ElementData
 * @property {string} tag
 * @property {object} attrs
 */

/**
 * https://dom.spec.whatwg.org/#dom-node-nodetype
 * @readonly
 * @typedef {enum} NODE_TYPE
 * @enum {Number}
 */
var NODE_TYPES = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3
};

/**
 * Creates a new node with specified data
 * and a pointer to its children
 * @class Node
 * @param {NODE_TYPES} type
 * @param {ElementData} data
 * @param {Node[]} children
 */
var Node = function(type, data, children) {
    this.nodeType = type;
    this.data = data;
    this.children = children;
};
Node.ELEMENT_NODE = NODE_TYPES.ELEMENT_NODE;
Node.TEXT_NODE = NODE_TYPES.TEXT_NODE;

module.exports = Node;
