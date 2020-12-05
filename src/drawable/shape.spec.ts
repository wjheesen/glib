import { expect } from 'chai';
import { PolygonMesh, Point, Rect, Vec2, Shape, Mat2d, LineSegment } from '..';

describe('Shape', () => {

    let star = new Shape(PolygonMesh.star(5, 0.6));

    describe('bounds', () => {
        it('initially matches the bounds of the underlying mesh', () => {
            expect(star.bounds).deep.equals(star.mesh.bounds);
        })
        it('can be used to place a shape inside a rect', () => {
            let dst = Rect.dimensions(0, 0, 6, 12);
            star.scaleToFit(dst);
            expect(star.bounds).deep.equals(dst);
        })
    })

    describe('center', () => {
        it('starts at the origin', () => {
            Mat2d.identity(star.matrix); // reset
            expect(star.center).deep.equals({x: 0, y: 0});
        })
        it('can be used to move the shape to a new center point', () => {
            star.center = {x: 3, y: 12};
            expect(star.bounds).deep.equals(Rect.offset(star.mesh.bounds, star.center));
        })
    })

    describe('#convertPointToWorldSpace()', () => {
        it('maps a point inside the mesh to a point inside the shape', () => {
            expect(star.convertPointToWorldSpace({x: 0, y: 0})).deep.equals(star.center);
        });
    });

    describe('#convertPointToModelSpace()', () => {
        it('maps a point inside the shape to a point inside the mesh', () => {
            expect(Point.equals(star.convertPointToModelSpace(star.center), {x: 0, y: 0}, 0.0001)).to.be.true;
        })
    });

    describe('#containsPoint()', () => {
        it('accounts for any transformations applied to the shape', () => {
            star.center = {x: 9, y: 15};
            expect(star.containsPoint(star.center)).to.be.true;
            expect(star.containsPoint({x: 0, y: 0})).to.be.false;
        })
    })

    describe('#translate()', () => {
        it('translates the shape by the specified vector', () => {
            let v: Vec2.Like = {x: -12, y: 23};
            let tc = Vec2.add(v, star.center);
            star.translate(v);
            expect(star.center).deep.equals(tc);
        })
    });

    describe('#scale()', () => {
        it('scales the shape out from the center', () => {
            let {center, bounds} = star;
            let w = Rect.width(bounds);
            let h = Rect.height(bounds);

            let v = {x: 2, y: 4};
            star.scale(v);
            expect(star.center).deep.equals(center);
            expect(Rect.width(star.bounds)).to.equal(v.x * w);
            expect(Rect.height(star.bounds)).to.equals(v.y * h);
        })
    });

    describe('#stretch()', () => {
        it('stretches the shape out from the center, preserving aspect', () => {
            let {center, bounds} = star;
            let aspect = Rect.width(bounds) / Rect.height(bounds)

            let r = 0.5;
            star.stretch(r);
            expect(star.center).deep.equals(center);

            let rbounds = star.bounds;
            let raspect = Rect.width(rbounds) / Rect.height(rbounds);
            expect(raspect).to.equal(aspect);
        })
    });

    describe('#rotate()', () => {
        it('rotates the shape around its center point', () => {
            let c = star.center;
            let v0 = star.vertexAt(0);
            let angle = Math.PI / 4;
            let rotation = Mat2d.pivot(Mat2d.rotate(angle), c);

            star.rotate(angle);
            expect(star.center).deep.equals(c);
            expect(Vec2.equals(star.vertexAt(0), Mat2d.mapPoint(rotation, v0), 0.0001));
        });
    })

    describe('#scaleToFit()', () => {
        it('scales the shape to fit inside the specified rect', () => {
            let dst = Rect.dimensions(0, 0, 12, 14);
            star.scaleToFit(dst);
            expect(star.bounds).deep.equals(dst);
        })
    })

    describe('#stretchAcrossLine()', () => {
        let hex = new Shape(PolygonMesh.regularPolygon(6));
        let aspect = getAspect();
        let line: LineSegment.Like = {p1: {x: 3, y: 12}, p2: {x: 15, y: -6}};
        hex.stretchAcross(line);

        it ('maps the topmost point to start of the line', () => {
            expect(Point.equals(hex.vertexAt(0), line.p1, 0.0001));
        })

        it ('maps the bottom most point to the end of the line', () => {
            expect(Point.equals(hex.vertexAt(5), line.p2, 0.0001));
        });

        it('preserves aspect', () => {
            expect(getAspect()).approximately(aspect, 0.0001);
        });

        function getAspect() {
            let width = Point.distance(hex.vertexAt(1), hex.vertexAt(5));
            let height = Point.distance(hex.vertexAt(0), hex.vertexAt(3));
            return  width / height;
        }
    })
})