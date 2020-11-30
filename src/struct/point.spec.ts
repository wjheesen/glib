import { expect } from 'chai';
import { copy, distance, distance2, equals, midpoint } from './point';

describe('point', () => {

    let p1 = {x: 1, y: 2};
    let p2 = {x: 3, y: 4};

    describe('#copy()', () => {
        it('creates a point that is equal to the copied point', () => {
            expect(copy(p1)).deep.equals(p1);
        })
    })
    
    describe('#midpoint()', () => {
        it('returns the midpoint of 2 points', () => {
            expect(midpoint(p1, p2)).deep.equals({x: 2, y: 3});
        })
    })
    
    describe('#distance()', () => {
        it('returns the distance between 2 points', () => {
            expect(distance(p1, p2)).approximately(Math.sqrt(8), 0.0001);
        })
    })
    
    describe('#distance2()', () => {
        it('returns the square of the distance between 2 points', () => {
            expect(distance2(p1, p2)).equals(8);
        })
    })

    describe('#equals()', () => {
        let p1 = {x: -16, y: 7};
        it('returns true when comparing a point to itself', () => {
            expect(equals(p1, p1)).to.be.true;
        })
        it('returns false if a value differs by more than the allowed amount', () => {
            let e = 0e05;
            let p2 = copy(p1);
            p1.y += 1.e04;
            expect(equals(p1, p2, e)).to.be.false;
        })
    })
})
