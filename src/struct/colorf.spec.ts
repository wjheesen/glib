import { expect } from 'chai';
import { Like, copy, fromRgbaInt, fromRgbInt, isOpaque as isOpaqueColor } from './color';
import { fromColor, isOpaque, premultiplyAlpha, random, toColor, equals } from './colorf';

let c1 = <Like> {r: 0.3, g: 0.2, b: 0.5, a: 0.7};

describe('colorf', () => {
    describe('#equals()', () => {
        it('returns true when comparing a color to itself', () => {
            expect(equals(c1, c1)).to.be.true;
        })
        it('returns false if a value differs by more than the allowed amount', () => {
            let e = 0e05;
            let c2 = copy(c1);
            c2.g += 1.e04;
            expect(equals(c1, c2, e)).to.be.false;
        })
    })

    describe('#fromColor()', () => {
        it('is reversible', () => {
            let original = fromRgbaInt(0xdd0aafdd);
            expect(toColor(fromColor(original))).deep.equals(original);
        })
    })

    describe('#toColor()', () => {
        it('preserves opacity', () => {
            let blue = fromColor(fromRgbInt(0xff));
            console.log(blue, toColor(blue));
            expect(isOpaqueColor(toColor(blue))).to.be.true;
        })
    })

    describe('#random()', () => {
        it('preserves the alpha value of the output variable', () => {
            expect(random(copy(c1)).a).equals(c1.a);
        })
        it("defaults to fully opaque if the output variable's alpha value is undefined", () => {
            expect(isOpaque(random()));
        })
    })

    describe('#isOpaque()', () => {
        it('returns true if the color is fully opaque', () => {
            expect(isOpaque({r: 1, g: 0.5, b: 0.2, a: 1})).to.be.true;
        })
        it('returns false if the color is even partially transparent', () => {
            expect(isOpaque(c1)).to.be.false;
        })
    })

    describe('#premultiplyAlpha()', () => {
        let pre = premultiplyAlpha(c1);
        it('reduces the rgb components of a color based on the alpha value', () => {
            expect(pre.r).lessThan(c1.r);
            expect(pre.g).lessThan(c1.g);
            expect(pre.b).lessThan(c1.b);
        })
        it('returns an opaque color', () => {
            expect(isOpaque(pre)).to.be.true;
        })
    })
})