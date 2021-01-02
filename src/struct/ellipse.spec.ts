import { expect } from 'chai';
import { Point, Vec2, Rect } from '..';
import { circle, containsPoint, copy, equals, fromRect } from './ellipse';

describe('ellipse', () => {

    let e1 = {rx: 1, ry: 2, c: {x: 3, y: 4}};

    describe('#copy()', () => {
        it('creates an ellipse that is equal to the copied ellipse', () => {
            expect(copy(e1)).deep.equals(e1);
        })
    })

    describe('#circle()', () => {
        let r = 3;
        let c = {x: 3, y: -2};
        let cir = circle(r, c);
        it('has matching width and height', () => {
            expect(cir.rx).equals(cir.ry);
        })
        it('is centered at the specified point', () => {
            expect(cir.c).deep.equals(c);
        })
    })

    describe('#fromRect()', () => {
        it('has the same width, height, and center point as the rect', () => {
            let r = Rect.dimensions(1, 2, 3, 4);
            let e = fromRect(r);
            expect(e.rx).equals(r.width / 2);
            expect(e.ry).equals(r.height / 2);
            expect(Point.equals(e.c, r.center())).to.be.true;
        })
    })

    describe('#containsPoint()', () => {
        it('always contains its center point', () => {
            expect(containsPoint(e1, e1.c)).to.be.true;
        })
        it('always contains its boundary points', () => {
            let left = Vec2.add(e1.c, {x: e1.rx, y: 0});
            let top = Vec2.add(e1.c, {x: 0, y: e1.ry});
            expect(containsPoint(e1, left)).to.be.true;
            expect(containsPoint(e1, top)).to.be.true;
        })
        it('returns false for points outside the ellipse', () => {
            expect(containsPoint(e1, Vec2.add(e1.c, {x: e1.rx, y: e1.ry}))).to.be.false;
        })
    })

    describe('#equals()', () => {
        it('returns true when comparing an ellipse to itself', () => {
            expect(equals(e1, e1)).to.be.true;
        })
        it('returns false if a value differs by more than the allowed amount', () => {
            let e = 0e05;
            let e2 = copy(e1);
            e2.rx += 1.e04;
            expect(equals(e1, e2, e)).to.be.false;
        })
    })
})
