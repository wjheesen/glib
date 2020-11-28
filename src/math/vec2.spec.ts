import { expect } from 'chai';
import { containsPoint, dimensions } from './rect';
import { add, bound, boundX, copy, cross, divide, dot, equals, fromPointToPoint, length, length2, multiply, normalize, rotate180, rotate270, rotate90, subtract } from './vec2';

describe('vec2', () => {

    let v1 = {x: 1, y: 2};
    let v2 = {x: 3, y: 4};

    describe('#copy()', () => {
        it('creates a vec2 that is equal to the copied vec2', () => {
            expect(copy(v1)).deep.equals(v1);
        })
    })

    describe('#add()', () => {
        it('adds 2 vectors together', () => {
            expect(add(v1, v2)).deep.equals({x: 4, y: 6});
        })
    })

    describe('#subtract()', () => {
        it('subtracts one vector from another', () => {
            expect(subtract(v1, v2)).deep.equals({x: -2, y: -2});
        })
    })

    describe('#multiply()', () => {
        it('multiplies each component of a vector by a value', () => {
            expect(multiply(v1, 2)).deep.equals({x: 2, y: 4});
        })
    })

    describe('#divide()', () => {
        it('divides each component of a vector by a value', () => {
            expect(divide(v1, 2)).deep.equals({x: 0.5, y: 1});
        })
    })
    
    describe('#length()', () => {
        it('measures the length of a vector', () => {
            expect(length(v1)).approximately(Math.sqrt(5), 0.0001);
        })
    })
    
    describe('#length2()', () => {
        it('measures the square of the length of a vector', () => {
            expect(length2(v1)).to.equal(5);
        })
    })
    
    describe('#dot()', () => {
        it('measures the dot product of 2 vectors', () => {
            expect(dot(v1, v2)).to.equal(11);
        })
    })
    
    describe('#cross()', () => {
        it('measures the cross product of 2 vectors', () => {
            expect(cross(v1, v2)).to.equal(-2);
        })
    })
    
    describe('#normalize()', () => {
        it('normalizes a non-zero vector to a length of 1', () => {
            expect(length(normalize(v1))).approximately(1, 0.0001);
        })
    })
    
    describe('#rotate90()', () => {
        it('rotates a vector 90 degrees CCW', () => {
            expect(rotate90(v1)).deep.equals({x: 2, y: -1});
        })
    })
    
    describe('#rotate180()', () => {
        it('rotates a vector 180 degrees CCW', () => {
            expect(rotate180(v1)).deep.equals({x: -1, y: -2});
        })
    })
    
    describe('#rotate270()', () => {
        it('rotates a vector 270 degrees CCW', () => {
            expect(rotate270(v1)).deep.equals({x: -2, y: 1});
        })
    })
    
    describe('#fromPointToPoint', () => {
        it('measures the vector from one point to another', () => {
            expect(fromPointToPoint(v1, v2)).deep.equals({x: 2, y: 2});
        })
    })

    describe('#bound()', () => {
        let p = {x: 0, y: 0};
        let b = dimensions(0, 2, 2, 2);
        it('does nothing if the translation vector would not cause the point to go out of bounds', () => {
            expect(containsPoint(b, add(v1, p))).to.be.true;
            expect(bound(v1, p, b)).deep.equals(v1);
        })

        it('shortens the translation vector to prevent the point from going out of bounds', () => {
            let vb = bound(v2, p, b);
            expect(containsPoint(b, add(v2, p))).to.be.false;
            expect(containsPoint(b, add(vb, p))).to.be.true;
            expect(length2(vb)).lessThan(length2(v2));
        })
    });

    describe('#boundX()', () => {
        let x = 0;
        let b = dimensions(0, 2, 2, 2);
        it('does nothing if the change in x would not cause the point to go out of bounds', () => {
            let dx = 1;
            expect(boundX(dx, x, b)).deep.equals(dx);
        });
        it('maps to the left boundary if the change in x would cause the point to fall to the left of the bounds', () => {
            let dx = -192;
            expect(boundX(dx, x, b) + x).deep.equals(b.left);
        });
        it('maps to the right boundary if the change in x would cause the point to fall to the right of the bounds', () => {
            let dx = 51;
            expect(boundX(dx, x, b) + x).deep.equals(b.right);
        });
    })

    describe('#boundX()', () => {
        let y = 0;
        let b = dimensions(0, 2, 2, 2);
        it('does nothing if the change in y would not cause the point to go out of bounds', () => {
            let dy = 1;
            expect(boundX(dy, y, b)).deep.equals(dy);
        });
        it('maps to the bottom boundary if the change in y would cause the point to fall below the bounds', () => {
            let dy = -192;
            expect(boundX(dy, y, b) + y).deep.equals(b.bottom);
        });
        it('maps to the top boundary if the change in y would cause the point to fall above the bounds', () => {
            let dy = 51;
            expect(boundX(dy, y, b) + y).deep.equals(b.top);
        });
    })

    describe('#equals()', () => {
        let v1 = {x: 12, y: -3};
        it('returns true when comparing a vector to itself', () => {
            expect(equals(v1, v1)).to.be.true;
        })
        it('returns false if a value differs by more than the allowed amount', () => {
            let e = 0e05;
            let v2 = copy(v1);
            v2.y += 1.e04;
            expect(equals(v1, v2, e)).to.be.false;
        })
    })
})
