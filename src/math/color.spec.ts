import { expect } from 'chai';
import { ColorLike, copy, equals, fromArgbString, toArgbString, fromRgbaInt, isOpaque, isTransparent, toRgbaInt, blend, random, fromRgbInt } from './color';

describe('color', () => {

    let c1 = <ColorLike> {r: 0xdd, g: 0x0a, b: 0xaf, a: 0xdd};

    describe('#copy()', () => {
        it('creates a color that is equal to the copied color', () => {
            expect(copy(c1)).deep.equals(c1);
        })
    })

    describe('#fromRgbaInt()', () => {
        it('converts an rgba int to a color', () => {
            expect(fromRgbaInt(0xdd0aafdd)).deep.equals(c1);
        })
    })

    describe('#fromRgbInt()', () => {
        it('converts an rgb int to a color', () => {
            expect(fromRgbInt(0xdd0aaf)).deep.equals(fromRgbaInt(0xdd0aafff));
        })
    })

    describe('#toRgbaInt()', () => {
        it('converts a color to an rgba int', () => {
            expect(toRgbaInt(c1)).equals(0xdd0aafdd);
        })
    })

    describe('#fromArgbString()', () => {
        it('converts an argb string to a color', () => {
            expect(fromArgbString('#dddd0aaf')).deep.equals(c1);
        })
        it('does not require the leading #', () => {
            expect(fromArgbString('dddd0aaf')).deep.equals(c1);
        })
    })

    describe('#toArgbString()', () => {
        it('converts a color to an argb string', () => {
            expect(toArgbString(c1)).equals('#dddd0aaf');
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

    describe('#blend()', () => {
        it('increases rgb components of the src color that are denser than the dst color', () => {
            let red = {r: 255, g: 0, b: 0, a: 127};
            let green = {r: 0, g: 255, b: 0, a: 255};
            let blended = blend(red, green);
            expect(blended.r).greaterThan(green.r);
        })
        it('does nothing if the src color is transparent', () => {
            expect(blend(fromRgbaInt(0xff00), c1)).deep.equals(c1);
        })
    })

    describe('#isOpaque()', () => {
        it('returns true if the color is fully opaque', () => {
            expect(isOpaque(fromRgbaInt(0xaaaaaaff))).to.be.true;
        })
        it('returns false if the color is even partially transparent', () => {
            expect(isOpaque(c1)).to.be.false;
        })
    })

    describe('#isTransparent()', () => {
        it('returns true if the color is fully transparent', () => {
            expect(isTransparent(fromRgbaInt(0xaaaaaa00))).to.be.true;
        })
        it('returns false if the color is not fully transparent', () => {
            expect(isTransparent(c1)).to.be.false;
        })
    })

    describe('#equals()', () => {
        it('returns true when comparing a color to itself', () => {
            expect(equals(c1, c1)).to.be.true;
        })
    })
})
