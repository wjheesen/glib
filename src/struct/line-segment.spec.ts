import { expect } from 'chai';
import { containsPoint, copy, equals, Like } from './line-segment';
import { midpoint } from './point';
import { add } from './vec2';

describe('line-segment', () => {

    let l1 = <Like> {p1: {x: 1, y: 2}, p2: {x: 3, y: 4}};

    describe('#copy()', () => {
        it('creates a line segment that is equal to the copied line segment', () => {
            expect(copy(l1)).deep.equals(l1);
        })
    })

    describe('#containsPoint()', () => {
        it('always contains the two ends of the line segment', () => {
            expect(containsPoint(l1, l1.p1)).to.be.true;
        })
        it('always contains the midpoint of the line segment', () => {
            expect(containsPoint(l1, midpoint(l1.p1, l1.p2))).to.be.true;
        })
        it('returns false for points outside the epsilon range of the line segment', () => {
            let epsilon = 0.2;
            let p = add(l1.p1, {x: -0.3, y: 0});
            expect(containsPoint(l1, p, epsilon)).to.be.false;
        })
    })
    
    describe('#equals()', () => {
        it('returns true when comparing a line segment to itself', () => {
            expect(equals(l1, l1)).to.be.true;
        })
        it('returns false if a value differs by more than the allowed amount', () => {
            let e = 0e05;
            let l2 = copy(l1);
            l2.p2.y += 1.e04;
            expect(equals(l1, l2, e)).to.be.false;
        })
    })
})
