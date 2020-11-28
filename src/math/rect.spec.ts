import { expect } from 'chai';
import { area, bottomLeft, bottomRight, center, centerX, centerY, contains, containsPoint, dimensions, empty, height, inset, offset, intersect, intersects, isEmpty, isValid, topLeft, topRight, union, unionPoint, width, sort, equals, copy, offsetX, offsetY } from './rect';

describe('rect', () => {

    let r1 = {left: 1, top: 2, right: 4, bottom: -2};
    let r2 = {left: 5, top: 6, right: 7, bottom: -8};

    describe('#copy()', () => {
        it('creates a rect that is equal to the copied rect', () => {
            expect(copy(r1)).deep.equals(r1);
        })
    })

    describe('#empty()', () => {
        it('returns a rect with area equal to 0', function () {
            expect(area(empty())).to.equal(0);
        });
        it('returns a rect with coordinates initialized to zero', function() {
            expect(empty()).deep.equals({left: 0, top: 0, right: 0, bottom: 0});
        });
    })
    
    describe('#dimensions()', () => {
        let rect = dimensions(1, 2, 3, 4);
        it('returns a rect with the specified dimensions', function() {
            expect(width(rect)).to.equal(3);
            expect(height(rect)).to.equals(4);
        })
        it('puts the top left corner of the rect in the specified position', function() {
            expect(rect.left).to.equal(1);
            expect(rect.top).to.equal(2);
        })
    })

    describe('#width()', () => {
        it('correctly measures the width of a rect', function() {
            expect(width(r1)).to.equal(3);
        })
    })

    describe('#height()', () => {
        it('correctly measures the height of a rect', function() {
            expect(height(r1)).to.equal(4);
        })
    })

    describe('#area()', () => {
        it('correctly measures the area of a rect', () => {
            expect(area(r1)).to.equal(12);
        })
    })

    describe('#center()', () => {
        it('correctly measures the center point of a rect', () => {
            expect(center(r1)).deep.equals({x: 2.5, y: 0})
        })
    })

    describe('#centerX()', () => {
        it('correctly measures the center x coordinate of a rect', () => {
            expect(centerX(r1)).to.equal(2.5);
        })
    })

    describe('#centerY()', () => {
        it('correctly measures the center y coordinate of a rect', () => {
            expect(centerY(r1)).to.equal(0);
        })
    })

    describe('#topLeft()', () => {
        it('returns the top left coordinate of a rect', () => {
            expect(topLeft(r1)).deep.equals({x: 1, y: 2});
        })
    })

    describe('#bottomLeft()', () => {
        it('returns the bottom left coordinate of a rect', () => {
            expect(bottomLeft(r1)).deep.equals({x: 1, y: -2});
        })
    })

    describe('#bottomRight()', () => {
        it('returns the bottom right coordinate of a rect', () => {
            expect(bottomRight(r1)).deep.equals({x: 4, y: -2});
        })
    })

    describe('#topRight()', () => {
        it('returns the top right coordinate of a rect', () => {
            expect(topRight(r1)).deep.equals({x: 4, y: 2});
        })
    })

    describe('#isEmpty()', () => {
        it('returns true for rect with all zero coordinates', () => {
            expect(isEmpty(empty())).to.be.true;
        })
        it('returns true for rect with width <= 0', () => {
            expect(isEmpty(dimensions(0, 0, -1, 1))).to.be.true;
        });
        it('returns true for rect with height <= 0', () => {
            expect(isEmpty(dimensions(0, 0, 1, -1))).to.be.true;
        });
        it('returns false for rect with width >= 0 and height >= 0', () => {
            expect(isEmpty(dimensions(0, 0, 1, 1))).to.be.false;
        })
    })
    
    describe('#isValid()', () => {
        it('returns false if width < 0', () => {
            expect(isValid(dimensions(0, 0, -1, 1))).to.be.false;
        })
        it('returns false if height < 0', () => {
            expect(isValid(dimensions(0, 0, 1, -1))).to.be.false;
        })
    })

    describe('#union()', () => {
        it('creates the smallest possible rect containing both of the specified rects', () => {
            let u = union(r1, r2);
            expect(contains(u, r1)).to.be.true;
            expect(contains(u, r2)).to.be.true;
            expect(union(r1, r2)).deep.equals({left: 1, right: 7, bottom: -8, top: 6});
        })
        it('returns the outer rect if one of the rects contains the other rect', () => {
            let smaller = dimensions(0, 0, 1, 1);
            let larger = dimensions(0, 0, 2, 2);
            expect(union(smaller, larger)).deep.equals(larger);
        })
    })

    describe('#union()', () => {
        let r = dimensions(0, 0, 1, 1);
        it('minimally expands the rect to contain the original rect and the specified point', () => {
            let p = {x: -2, y: -3};
            let u = unionPoint(r, p);
            expect(contains(u, r)).to.be.true;
            expect(containsPoint(u, p)).to.be.true;
            expect(unionPoint(r, p)).deep.equals({left: -2, right: 1, bottom: -3, top: 0});
        })
        it('does nothing if the rect already contains the point', () => {
            expect(unionPoint(r, {x: 0, y: -1})).deep.equals(r);
        })
    })

    describe('#intersects()', () => {
        it('returns true if one of the rects contains the other rectangle', () => {
            let u = union(r1, r2);
            expect(intersects(u, r1)).to.be.true;
            expect(intersects(u, r2)).to.be.true;
        })
        it('returns true the rects have some overlap', () => {
            expect(intersects(dimensions(0, 0, 2, 2), dimensions(1, 1, 2, 2))).to.be.true;
        })
        it('returns false if the rects have no overlap', () => {
            expect(intersects(dimensions(0, 0, 2, 2), dimensions(5, 5, 2, 2))).to.be.false
        })
    });

    describe('#intersect()', () => {
        it('correctly finds the intersection of two overlapping rects', () => {
            expect(intersect(r1, r2)).deep.equals({left: 5, top: 2, right: 4, bottom: -2});
        });
        it('returns the inner rect if one of the rects contains the other rect', () => {
            expect(intersect(union(r1, r2), r1)).deep.equals(r1);
        });
        it('returns an empty rect if the rects have no overlap', () => {
            expect(empty(intersect(dimensions(0, 0, 2, 2), dimensions(5, 5, 2, 2))));
        });
    })

    describe('#inset()', () => {
        it('correctly insets the rect by the specified vector', () => {
            expect(inset(r1, {x: 1, y: 2})).deep.equals({left: 2, top: 0, right: 3, bottom: 0});
        })
        it('decreases the size of the rect if the vector coordinates are positive', () => {
            expect(area(r1)).greaterThan(area(inset(r1, {x: 1, y: 1})));
        })
    })

    describe('#offset()', () => {
        it('correctly offsets the rect by the specified vector', () => {
            expect(offset(r1, {x: 1, y: 2})).deep.equals({left: 2, top: 4, right: 5, bottom: 0});
        })
        it('preserves the width and height of the rect', () => {
            let o = offset(r1, {x: 1, y: 2});
            expect(width(o)).equals(width(r1));
            expect(height(o)).equals(height(r1));
        });
    })

    describe('#offsetX()', () => {
        it('never changes the top and bottom rect coordinates', () => {
            let rb = offsetX(r1, 23);
            expect(rb.top).equals(r1.top);
            expect(rb.bottom).equals(r1.bottom);
        })
    })

    describe('#offsetY()', () => {
        it('never changes the left and right rect coordinates', () => {
            let rb = offsetY(r1, 23);
            expect(rb.left).equals(r1.left);
            expect(rb.right).equals(r1.right);
        })
    })

    describe('#contains()', () => {
        it('returns true if both rects are the same', () => {
            expect(contains(r1, r1)).to.be.true;
        })
        it('returns true if the first rect contains the second rect', () => {
            expect(contains(dimensions(0, 0, 1, 4), dimensions(0, 0, 1, 1))).to.be.true;
        })
        it ('returns false if any part of the second rect exists outside the first rect', () => {
            expect(contains(dimensions(0, 0, 1, 1), dimensions(0, 0, 1, 4))).to.be.false;
        });
    });

    describe('#containsPoint()', () => {
        it('returns true for points inside the rect', () => {
            expect(containsPoint(r1, center(r1))).to.be.true;
        })
        it('returns true for points on the edge of the rect', () => {
            expect(containsPoint(r1, {x: 1, y: 2})).to.be.true;
        })
        it('returns false for points outside the rect', () => {
            expect(containsPoint(r1, {x: -1, y: 2})).to.be.false
        })
    })

    describe('#sort()', () => {
        it('causes an invalid rect to become valid', () => {
            expect(isValid(sort(dimensions(0, 0, -1, -1)))).to.be.true;
        })
        it('does nothing if the rect already has valid dimensions', () => {
            expect(sort(r1)).deep.equals(r1);
        })
    })

    describe('#equals()', () => {
        let r = dimensions(1, 2, 3, 4);
        it('returns true when comparing a rect to itself', () => {
            expect(equals(r, r)).to.be.true;
        })
        it('returns false if a value differs by more than the allowed amount', () => {
            let e = 0e05;
            let r2 = copy(r);
            r2.bottom += 1.e04;
            expect(equals(r, r2, e)).to.be.false;
        })
    })
})
