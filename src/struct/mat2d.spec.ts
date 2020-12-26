import { expect } from 'chai';
import { Point } from '..';
import { concat, conjugate, identity, invert, rotate, stretch, translate, Like, determinant, mapPoint, pivot, scale, mapRect, equals, sinCos, rectToRect, ScaleToFit, scaleToPoint, stretchRotateToPoint, copy} from './mat2d';
import { dimensions, area, width, height, center, bottomRight, contains, topLeft } from './rect';

describe('Mat2d', () => {

    let m = <Like> {
        c1r1: 1, c2r1: 2, c3r1: 3,
        c1r2: 5, c2r2: 7, c3r2: 11
    };

    describe('#copy()', () => {
        it('creates a 2d matrix that is equal to the copied matrix', () => {
            expect(copy(m)).deep.equals(m);
        })
    })

    describe('#invert()', () => {
        it('finds the inverse B of a 2d matrix A such that A x B = I (the identity matrix)', () => {
            let r45 = rotate(Math.PI / 4);
            let r315 = invert(r45);
            expect(concat(r45, r315)).deep.equals(identity());
        })
    })

    describe('#determinant()', () => {
        it('finds the determinant of a 2d matrix', () => {
            expect(determinant(m)).to.equal(-3);
        })
    })

    describe('#concat()', () => {
        it('finds the product of two 2d matrices', () => {
            let a = translate({x: 24, y: -13})
            let b = rotate(97);
            let c = concat(a, b);
            let p  = {x: 11, y: 34.5};
            let abp = mapPoint(a, mapPoint(b, p));
            let cp = mapPoint(c, p);
            expect(abp).deep.equals(cp);
        })
    })

    describe('#pivot()', () => {
        it("translates the center of rotation by the specified vector", () => {
            let v = {x: 2, y: 2};
            let r45 = rotate(Math.PI / 4);
            let r45x2y2 = pivot(r45, v);
            expect(mapPoint(r45x2y2, v)).deep.equals(v);
        })
        it("translates the fixed point of a scale matrix by the specified vector", () => {
            let v = {x: 2, y: 2};
            let s = scale({x: 3, y: 4})
            let sx2y2 = pivot(s, v);
            expect(mapPoint(sx2y2, v)).deep.equals(v);
        })
        it('has no effect on a translation matrix', () => {
            let v = {x: 2, y: 2};
            let t = translate({x: 12, y: -17})
            expect(pivot(t, v)).deep.equals(t);
        })
    })

    describe('#conjugate()', () => {
        it('has no effect on the identity matrix', () => {
            let r45 = rotate(Math.PI / 4);
            let i = identity();
            expect(conjugate(i, r45)).deep.equals(i);
        })
    })

    describe('#identity()', () => {
        let i = identity();
        it('maps a point to itself', () => {
            let p = {x: 3, y: 4};
            expect(mapPoint(i, p)).deep.equals(p);
        })
    })

    describe('#translate()', () => {
        let t = translate({x: 5, y: 13})
        it('translates a point by the specified vector', () => {
            expect(mapPoint(t, {x: 2, y: 3})).deep.equals({x: 7, y: 16})
        })
        it('preserves the area of a rectangle', () => {
            let r = dimensions(0, 0, 2, 7);
            let tr = mapRect(t, r);
            expect(area(tr)).equals(area(r));
        })
    })

    describe('#scale()', () => {
        it('scales a rect by the specified vector', () => {
            let r = dimensions(0, 0, 1, 1);
            let s = scale({x: 3, y: 2})
            let sr = mapRect(s, r);
            expect(area(sr)).equals(6 * area(r))
        })
        it('scales from the origin', () => {
            let o = {x: 0, y: 0};
            let s = scale({x: 21, y: -17})
            expect(mapPoint(s, o)).deep.equals(o);
        })
    })

    describe('#scaleToPoint()', () => {
        let start = {x: 4, y: 3};
        let end = {x: 8, y: 12};
        let p = {x: 6, y: 5};
        let s = scaleToPoint(start, end, p);
        it('maps the start point to the end point', () => {
            expect(mapPoint(s, start)).deep.equals(end);
        })
        it('fixes the pivot point', () => {
            expect(mapPoint(s, p)).deep.equals(p);
        })
    })

    describe('#stretch()', () => {
        it('preserves aspect ratio', () => {
            let r = dimensions(0, 0, 1, 2);
            let s = stretch(3);
            let sr = mapRect(s, r);
            expect(width(sr) / height(sr)).equals(width(r) / height(r));
        })
    })

    describe('#rotate()', () => {
        it('can be inverted by flipping the rotation angle', () => {
            let a = Math.PI / 2;
            let r90 = rotate(a);
            let r270 = rotate(-a);
            expect(equals(invert(r90), r270)).to.be.true;
        })
    })

    describe('#stretchRotateToPoint()', () => {
        let start = {x: 4, y: 3};
        let end = {x: 8, y: 12};
        let p = {x: 6, y: 5};
        let s = stretchRotateToPoint(start, end, p);
        it('maps the start point to the end point', () => {
            expect(Point.equals(mapPoint(s, start), end, 0.00001)).to.be.true;
        })
        it('fixes the pivot point', () => {
            expect(mapPoint(s, p)).deep.equals(p);
        })
    })

    describe('#sinCos()', () => {
        it('rotates from the origin', () => {
            let o = {x: 0, y: 0};
            let r90 = sinCos(1, 0);
            expect(mapPoint(r90, o)).deep.equals(o);
        })
    })

    describe('#rectToRect()', () => {
        let square = dimensions(0, 5, 5, 5);
        let rectangle = dimensions(0, 2, 4, 2);
        let options = [ScaleToFit.Center, ScaleToFit.End, ScaleToFit.Fill, ScaleToFit.Start];
        let mapped = options.map(option => mapRect(rectToRect(square, rectangle, option), square));

        it('fits the src rect inside the dst rect', () => {
            for (let result of mapped) {
                expect(contains(rectangle, result)).to.be.true;
            }
        })
        it('preserves aspect if the ScaleToFit option is set to Center, End, or Start', () => {
            for (let stf of [ScaleToFit.Center, ScaleToFit.End, ScaleToFit.Start]) {
                let result = mapped[stf];
                expect(width(result) / height(result)).equals(1);
            }
        })
        it('can change aspect if ScaleToFit option is set to Fill', ()  => {
            let result = mapped[ScaleToFit.Fill];
            expect(width(result) / height(result)).not.equals(1);
        })
        it('ScaleToFit.Center centers the src rect inside the dst rect', () => {
            let result = mapped[ScaleToFit.Center];
            expect(center(result)).deep.equals(center(rectangle));
        })
        it('ScaleToFit.End translates the src rect to the bottom right corner of the dst rect', () => {
            let result = mapped[ScaleToFit.End]
            expect(bottomRight(result)).deep.equals(bottomRight(rectangle));
        })
        it('ScaleToFit.Start translates the src rect to the top left corner of the dst rect', () => {
            let result = mapped[ScaleToFit.Start];
            expect(topLeft(result)).deep.equals(topLeft(rectangle));
        })
    })

    describe('#equals()', () => {
        it('returns true when comparing a matrix to itself', () => {
            let m = pivot(rotate(Math.PI / 6), {x: 12, y: -6})
            expect(equals(m, m)).to.be.true;
        })
        it('returns false if a value differs by more than the allowed amount', () => {
            let e = 0e05;
            let m2 = concat(identity(), m);
            m2.c3r1 += 1.e04;
            expect(equals(m, m2, e)).to.be.false;
        })
    })
})