var expect = require('chai').expect;
var Node = require('../../src/node.js');
var Parser = require('../../src/html.js');

var html = [
    '<html>',
        '<body class="foo">',
            '<h1 data-foo="bar">hello!</h1>',
            '<p>world</p>',
        '</body>',
    '</html>'
].join('');

describe('HTML Parser', function() {
    describe('should parse ' + html + ' and return dom ->', function() {
        beforeEach(function() {
            var parser = new Parser(html);
            this.rootNode = parser.parse();
        });
        describe('html node ->', function() {
            it('should have element type', function() {
                expect(this.rootNode.nodeType).to.equal(1);
            });
            it('should have html tag', function() {
                expect(this.rootNode.data).to.have.property('tag').and.equal('html');
            });
            describe('body node ->', function() {
                beforeEach(function() {
                    this.bodyNode = this.rootNode.children[0];
                });
                it('should have element type', function() {
                    expect(this.bodyNode.nodeType).to.equal(1);
                });
                describe('should have data', function() {
                    beforeEach(function() {
                        this.data = this.bodyNode.data;
                    });
                    it('tag = body', function() {
                        expect(this.bodyNode.data).to.have.property('tag').and.equal('body');
                    });
                    it('attributes: class = "value"', function() {
                        expect(this.bodyNode.data.attrs).to.have.property('class').and.equal('foo');
                    });
                });
                describe('h1 node ->', function() {
                    beforeEach(function() {
                        this.h1Node = this.bodyNode.children[0];
                    });
                    it('should have element type', function() {
                        expect(this.h1Node.nodeType).to.equal(1);
                    });
                    describe('should have data', function() {
                        beforeEach(function() {
                            this.data = this.h1Node.data;
                        })
                        it('tag = h1', function() {
                            expect(this.data).to.have.property('tag').and.equal('h1');
                        });
                        it('attibutes: data-foo = "value"', function() {
                            expect(this.data.attrs).to.have.property('data-foo').and.equal('bar');
                        });
                    })

                    describe('text node ->', function() {
                        beforeEach(function() {
                            this.textNode = this.h1Node.children[0];
                        });
                        it('should have text type', function() {
                            expect(this.textNode.nodeType).to.equal(3);
                        });
                        it('should have no data', function() {
                            expect(this.textNode.data).to.equal(null);
                        });
                        it('should contains hello! as its children', function() {
                            expect(this.textNode.children[0]).to.equal('hello!');
                        });
                    });
                });
                describe('p node ->', function() {
                    beforeEach(function() {
                        this.pNode = this.bodyNode.children[1];
                    });
                    it('should have element type', function() {
                        expect(this.pNode.nodeType).to.equal(1);
                    });
                    describe('should have data', function() {
                        beforeEach(function() {
                            this.data = this.pNode.data;
                        });
                        it('tag = p', function() {
                            expect(this.data).to.have.property('tag').and.equal('p');
                        });
                    })

                    describe('text node ->', function() {
                        beforeEach(function() {
                            this.textNode = this.pNode.children[0];
                        });
                        it('should have text type', function() {
                            expect(this.textNode.nodeType).to.equal(3);
                        });
                        it('should have no data', function() {
                            expect(this.textNode.data).to.equal(null);
                        });
                        it('should contains world as its children', function() {
                            expect(this.textNode.children[0]).to.equal('world');
                        });
                    });
                });
            });
        });
    });
});
