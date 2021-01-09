import { expect } from 'chai';
import { LineSegment } from '..';
import { midpoint } from './point';
import { add } from './vec2';

describe('LineSegment', () => {

    let l1 = new LineSegment({x: 1, y: 2}, {x: 3, y: 4});

    describe('#containsPoint()', () => {
        it('always contains the two ends of the line segment', () => {
            expect(l1.containsPoint(l1.p1)).to.be.true;
        })
        it('always contains the midpoint of the line segment', () => {
            expect(l1.containsPoint(l1.midpoint)).to.be.true;
        })
        it('returns false for points outside the epsilon range of the line segment', () => {
            let epsilon = 0.2;
            let p = add(l1.p1, {x: -0.3, y: 0});
            expect(l1.containsPoint(p, epsilon)).to.be.false;
        })
    })
    
    describe('#equals()', () => {
        it('returns true when comparing a line segment to itself', () => {
            expect(l1.equals(l1)).to.be.true;
        })
        it('returns false if a value differs by more than the allowed amount', () => {
            let e = 0e05;
            let l2 = l1.copy();
            l2.p2.y += 1.e04;
            expect(l1.equals(l2, e)).to.be.false;
        })
    })
})
