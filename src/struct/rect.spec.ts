import { expect } from 'chai';
import { Rect } from './rect';

describe('Rect', () => {

    let r1 = Rect.copy({left: 1, top: 2, right: 4, bottom: -2});
    let r2 = Rect.copy({left: 5, top: 6, right: 7, bottom: -8});

    describe('#copy()', () => {
        it('creates a rect that is equal to the copied rect', () => {
            expect(Rect.copy(r1)).deep.equals(r1);
        })
    })

    describe('#empty()', () => {
        it('returns a rect with area equal to 0', function () {
            expect(Rect.empty().area).to.equal(0);
        });
        it('returns a rect with coordinates initialized to zero', function() {
            expect(Rect.empty().equals({left: 0, top: 0, right: 0, bottom: 0})).to.be.true;
        })
    })
    
    describe('#dimensions()', () => {
        let rect = Rect.dimensions(1, 2, 3, 4);
        it('returns a rect with the specified dimensions', function() {
            expect(rect.width).to.equal(3);
            expect(rect.height).to.equals(4);
        })
        it('puts the top left corner of the rect in the specified position', function() {
            expect(rect.left).to.equal(1);
            expect(rect.top).to.equal(2);
        })
    })

    describe('#width', () => {
        it('correctly measures the width of a rect', function() {
            expect(r1.width).to.equal(3);
        })
    })

    describe('#height()', () => {
        it('correctly measures the height of a rect', function() {
            expect(r1.height).to.equal(4);
        })
    })

    describe('#aspect()', () => {
        it('correctly measures the width-to-height aspect of a rect', function() {
            expect(r1.aspect).to.equal(0.75);
        })
    })

    describe('#area()', () => {
        it('correctly measures the area of a rect', () => {
            expect(r1.area).to.equal(12);
        })
    })

    describe('#center()', () => {
        it('correctly measures the center point of a rect', () => {
            expect(r1.center()).deep.equals({x: 2.5, y: 0})
        })
    })

    describe('#centerX()', () => {
        it('correctly measures the center x coordinate of a rect', () => {
            expect(r1.centerX).to.equal(2.5);
        })
    })

    describe('#centerY()', () => {
        it('correctly measures the center y coordinate of a rect', () => {
            expect(r1.centerY).to.equal(0);
        })
    })

    describe('#topLeft()', () => {
        it('returns the top left coordinate of a rect', () => {
            expect(r1.topLeft()).deep.equals({x: 1, y: 2});
        })
    })

    describe('#bottomLeft()', () => {
        it('returns the bottom left coordinate of a rect', () => {
            expect(r1.bottomLeft()).deep.equals({x: 1, y: -2});
        })
    })

    describe('#bottomRight()', () => {
        it('returns the bottom right coordinate of a rect', () => {
            expect(r1.bottomRight()).deep.equals({x: 4, y: -2});
        })
    })

    describe('#topRight()', () => {
        it('returns the top right coordinate of a rect', () => {
            expect(r1.topRight()).deep.equals({x: 4, y: 2});
        })
    })

    describe('#isEmpty()', () => {
        it('returns true for rect with all zero coordinates', () => {
            expect(Rect.empty().isEmpty()).to.be.true;
        })
        it('returns true for rect with width <= 0', () => {
            expect(Rect.dimensions(0, 0, -1, 1).isEmpty()).to.be.true;
        });
        it('returns true for rect with height <= 0', () => {
            expect(Rect.dimensions(0, 0, 1, -1).isEmpty()).to.be.true;
        });
        it('returns false for rect with width >= 0 and height >= 0', () => {
            expect(Rect.dimensions(0, 0, 1, 1).isEmpty()).to.be.false;
        })
    })
    
    describe('#isValid()', () => {
        it('returns false if width < 0', () => {
            expect(Rect.dimensions(0, 0, -1, 1).isValid()).to.be.false;
        })
        it('returns false if height < 0', () => {
            expect(Rect.dimensions(0, 0, 1, -1).isValid()).to.be.false;
        })
    })

    describe('#union()', () => {
        it('creates the smallest possible rect containing both of the specified rects', () => {
            let u = Rect.copy(r1); u.union(r2);
            expect(u.contains(r1)).to.be.true;
            expect(u.contains(r2)).to.be.true;
            expect(u.equals({left: 1, right: 7, bottom: -8, top: 6})).to.be.true;
        })
        it('returns the outer rect if one of the rects contains the other rect', () => {
            let smaller = Rect.dimensions(0, 0, 1, 1);
            let larger = Rect.dimensions(0, 0, 2, 2);
            let u = Rect.copy(smaller); u.union(larger);
            expect(u.equals(larger)).to.be.true;
        })
    })

    describe('#union()', () => {
        let r = Rect.dimensions(0, 0, 1, 1);
        it('minimally expands the rect to contain the original rect and the specified point', () => {
            let p = {x: -2, y: -3};
            let u = Rect.copy(r); u.unionPoint(p);
            expect(u.contains(r)).to.be.true;
            expect(u.containsPoint(p)).to.be.true;
            expect(u.equals({left: -2, right: 1, bottom: -3, top: 0})).to.be.true;
        })
        it('does nothing if the rect already contains the point', () => {
            let u = Rect.copy(r); u.unionPoint({x: 0, y: -1});
            expect(u.equals(r)).to.be.true;
        })
    })

    describe('#intersects()', () => {
        it('returns true if one of the rects contains the other rectangle', () => {
            let u = Rect.copy(r1); u.union(r2);
            expect(u.intersects(r1)).to.be.true;
            expect(u.intersects(r2)).to.be.true;
        })
        it('returns true if the rects have some overlap', () => {
            expect(Rect.dimensions(0, 0, 2, 2).intersects(Rect.dimensions(1, 1, 2, 2))).to.be.true;
        })
        it('returns false if the rects have no overlap', () => {
            expect(Rect.dimensions(0, 0, 2, 2).intersects(Rect.dimensions(5, 5, 2, 2))).to.be.false;
        })
    });

    describe('#intersect()', () => {
        it('correctly finds the intersection of two overlapping rects', () => {
            let intersection = Rect.copy(r1); intersection.intersect(r2);
            expect(intersection.equals({left: 5, top: 2, right: 4, bottom: -2})).to.be.true;
        });
        it('returns the inner rect if one of the rects contains the other rect', () => {
            let union = Rect.copy(r1); union.union(r2);
            let intersection = Rect.copy(union); intersection.intersect(r1);
            expect(intersection.equals(r1)).to.be.true;
        });
        it('returns an empty rect if the rects have no overlap', () => {
            let r = Rect.dimensions(0, 0, 2, 2);
            r.intersect(Rect.dimensions(5, 5, 2, 2));
            expect(r.isEmpty());
        });
    })

    describe('#inset()', () => {
        it('correctly insets the rect by the specified vector', () => {
            let inset = Rect.copy(r1);
            inset.inset({x: 1, y: 2});
            expect(inset.equals({left: 2, top: 0, right: 3, bottom: 0})).to.be.true;
        })
        it('decreases the size of the rect if the vector coordinates are positive', () => {
            let inset = Rect.copy(r1);
            inset.inset({x: 1, y: 1});
            expect(r1.area).greaterThan(inset.area);
        })
    })

    describe('#offset()', () => {
        let offset = Rect.copy(r1); offset.offset({x: 1, y: 2});
        it('correctly offsets the rect by the specified vector', () => {
            expect(offset.equals({left: 2, top: 4, right: 5, bottom: 0})).to.be.true;
        })
        it('preserves the width and height of the rect', () => {
            expect(offset.width).equals(r1.width);
            expect(offset.height).equals(r1.height);
        });
    })

    describe('#offsetX()', () => {
        it('never changes the top and bottom rect coordinates', () => {
            let rb = Rect.copy(r1); rb.offsetX(23);
            expect(rb.top).equals(r1.top);
            expect(rb.bottom).equals(r1.bottom);
        })
    })

    describe('#offsetY()', () => {
        it('never changes the left and right rect coordinates', () => {
            let rb = Rect.copy(r1); rb.offsetY(23);
            expect(rb.left).equals(r1.left);
            expect(rb.right).equals(r1.right);
        })
    })

    describe('#contains()', () => {
        it('returns true if both rects are the same', () => {
            expect(r1.contains(r1)).to.be.true;
        })
        it('returns true if the first rect contains the second rect', () => {
            expect(Rect.dimensions(0, 0, 1, 4).contains(Rect.dimensions(0, 0, 1, 1))).to.be.true;
        })
        it ('returns false if any part of the second rect exists outside the first rect', () => {
            expect(Rect.dimensions(0, 0, 1, 1).contains(Rect.dimensions(0, 0, 1, 4))).to.be.false;
        });
    });

    describe('#containsPoint()', () => {
        it('returns true for points inside the rect', () => {
            expect(r1.containsPoint(r1.center())).to.be.true;
        })
        it('returns true for points on the edge of the rect', () => {
            expect(r1.containsPoint({x: 1, y: 2})).to.be.true;
        })
        it('returns false for points outside the rect', () => {
            expect(r1.containsPoint({x: -1, y: 2})).to.be.false
        })
    })

    describe('#sort()', () => {
        it('causes an invalid rect to become valid', () => {
            let r = Rect.dimensions(0, 0, -1, -1); 
            r.sort();
            expect(r.isValid()).to.be.true;
        })
        it('does nothing if the rect already has valid dimensions', () => {
            let r = Rect.copy(r1);
            r.sort();
            expect(r.equals(r1)).to.be.true;
        })
    })

    describe('#equals()', () => {
        let r = Rect.dimensions(1, 2, 3, 4);
        it('returns true when comparing a rect to itself', () => {
            expect(r.equals(r)).to.be.true;
        })
        it('returns false if a value differs by more than the allowed amount', () => {
            let e = 0e05;
            let r2 = Rect.copy(r);
            r2.bottom += 1.e04;
            expect(r.equals(r2, e)).to.be.false;
        })
    })
})
