import { expect } from 'chai';
import { PolygonMesh, Point, Rect, Vec2, PolygonModel, Mat2d, LineSegment, EllipseModel } from '..';

describe('EllipseModel', () => {

    let ellipse = new EllipseModel;

    describe('bounds', () => {
        it('initially matches the bounds of the underlying mesh', () => {
            expect(ellipse.bounds).deep.equals(ellipse.mesh.bounds);
        })
        it('can be used to place an ellipse inside a rect', () => {
            let dst = Rect.dimensions(0, 0, 6, 12);
            ellipse.bounds = dst;
            expect(ellipse.bounds).deep.equals(dst);
        })
    })

    describe('#containsPoint()', () => {
        it('accounts for any transformations applied to the ellipse', () => {
            Mat2d.scale({x: 2, y: 1}, ellipse.matrix);
            expect(ellipse.containsPoint({x: 1.9, y: 0})).to.be.true;
            ellipse.rotate(Math.PI / 2);
            expect(ellipse.containsPoint({x: 0, y: 1.9})).to.be.true;
            expect(ellipse.containsPoint({x: 1.9, y: 0})).to.be.false;
        })
    })
})