var expect = require('chai').expect;
var Parser = require('../../src/css.js');

var cssDecls = [
    '.foo { color: red; }',
    '#bar { background: url("foo.jpg"); color: #000; }',
    'h1.foo.bar, h2.baz { padding-top: 20px; margin: 10px; }'
];
var css = cssDecls.join(' ');

describe('CSS Parser', function() {
    describe('should parse ' + css, function() {
        beforeEach(function() {
            var parser = new Parser(css);
            this.rules = parser.parse();
        });
        it('return an array of 3 rules', function() {
            expect(this.rules.length).to.eql(3);
        });
        describe('rules with proper ->', function() {
            describe(cssDecls[0], function() {
                beforeEach(function() {
                    this.rule = this.rules[0];
                });

                it('selectors', function() {
                    expect(this.rule.selectors).to.eql([{
                        classes: ['foo'],
                        id: null,
                        tag: null
                    }]);
                });
                it('declarations', function() {
                    expect(this.rule.declarations).to.eql([{
                        color: 'red'
                    }]);
                });
            });
            describe(cssDecls[1], function() {
                beforeEach(function() {
                    this.rule = this.rules[1];
                });

                it('selectors', function() {
                    expect(this.rule.selectors).to.eql([{
                        classes: [],
                        id: 'bar',
                        tag: null
                    }]);
                });
                it('declarations', function() {
                    expect(this.rule.declarations).to.eql([
                        { background: 'url("foo.jpg")' },
                        { color: '#000' }
                    ]);
                });
            });
            describe(cssDecls[2], function() {
                beforeEach(function() {
                    this.rule = this.rules[2];
                });

                it('selectors', function() {
                    expect(this.rule.selectors).to.eql([
                        {
                            classes: ['foo', 'bar'],
                            id: null,
                            tag: 'h1'
                        },
                        {
                            classes: ['baz'],
                            id: null,
                            tag: 'h2'
                        }
                    ]);
                });
                it('declarations', function() {
                    expect(this.rule.declarations).to.eql([
                        { 'padding-top': '20px' },
                        { margin: '10px' }
                    ]);
                });
            });
        });
    });
});
