var expect = require('chai').expect;
var Node = require('../../src/node.js');
var Parser = require('../../src/html-parser.js');

describe('HTML Parser', function() {
    describe('should parse <html><body class="foo"><h1 data-foo="bar">hello!</h1></body></html> and return dom ->', function() {
        beforeEach(function() {
            var parser = new Parser('<html><body class="foo"><h1 data-foo="bar">hello!</h1></body></html>');
            this.rootNode = parser.parse();
        });
        describe('html node ->', function() {
            it('should have element type', function() {
                expect(this.rootNode.nodeType).to.equal(1);
            });
            it('should have html tag', function() {
                expect(this.rootNode.data).to.have.property('tag').and.equal('html');
            });
            it('should have a pointer to another node', function() {
                expect(this.rootNode.children instanceof Node).to.equal(true);
            });
            describe('body node ->', function() {
                beforeEach(function() {
                    this.bodyNode = this.rootNode.children;
                });
                it('should have element type', function() {
                    expect(this.bodyNode.nodeType).to.equal(1);
                });
                it('should have a pointer to another node', function() {
                    expect(this.bodyNode.children instanceof Node).to.equal(true);
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
                        this.h1Node = this.bodyNode.children;
                    });
                    it('should have element type', function() {
                        expect(this.h1Node.nodeType).to.equal(1);
                    });
                    it('should have a pointer to another node', function() {
                        expect(this.h1Node.children instanceof Node).to.equal(true);
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
                            this.textNode = this.h1Node.children;
                        });
                        it('should have text type', function() {
                            expect(this.textNode.nodeType).to.equal(3);
                        });
                        it('should have no data', function() {
                            expect(this.textNode.data).to.equal(null);
                        });
                        it('should have no pointer to another node', function() {
                            expect(this.textNode.children instanceof Node).to.equal(false);
                        });
                        it('should contains hello! as its children', function() {
                            expect(this.textNode.children).to.equal('hello!');
                        });
                    });
                });
            });
        });
    });
});
