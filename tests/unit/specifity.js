var expect = require('chai').expect;
var Specifity = require('../../src/specifity.js');

describe('Specifity', function() {
    describe('#calcSpecifity', function() {
        it('for selector .foo.bar should calc specifity equals to 20', function() {
            var specifify = new Specifity({
                classes: ['foo', 'bar'],
                id: null,
                tag: null
            });
            expect(specifify.value).to.equal(20);
        });
        it('for selector #bar.foo should calc specifity equals to 110', function() {
            var specifify = new Specifity({
                classes: ['foo'],
                id: 'bar',
                tag: null
            });
            expect(specifify.value).to.equal(110);
        });
        it('for selector h1.foo.bar should calc specifity equals to 21', function() {
            var specifify = new Specifity({
                classes: ['foo', 'bar'],
                id: null,
                tag: 'h1'
            });
            expect(specifify.value).to.equal(21);
        });
        it('should return specifity value if casted to number', function() {
            var specifify = new Specifity({
                classes: ['foo', 'bar'],
                id: null,
                tag: null
            });
            expect(Number(specifify)).to.equal(20);
        });
    })
});
