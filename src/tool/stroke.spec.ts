import { expect } from 'chai';
import { Point, Stroke, Vec2 } from '..';

describe('Stroke', () => {
    let stroke = new Stroke;
    let vertices = stroke.vertices;
    let width = 2;
    let p0 = {x: 1, y: 2};
    let p1 = {x: 5, y: 6};
    let e = 0.00001;
    
    describe('#moveTo()', () => {
        stroke.moveTo(p0, width);
        it('creates a top and bottom vertex separated by the desired thickness, with the given point in the middle', () => {
            expect(stroke.vertices.length).equals(2);
            let top = stroke.vertices[0];
            let bot = stroke.vertices[1];
            expect(top.y).greaterThan(bot.y);
            expect(Point.distance(top, bot)).approximately(width, e);
            expect(Point.equals(Point.midpoint(top, bot), p0));
        })
    })

    describe('#lineTo()', () => {
        it('throws an exception if called before making a call to moveTo()', () => {
            expect(() => (new Stroke).lineTo(p0, width)).to.throw;
        })

        it('creates a line segment from the previous top and bottom vertex to a new top and bottom vertex', () => {
            stroke.lineTo(p1, width);
            let topToTop = Vec2.fromPointToPoint(vertices[0], vertices[2]);
            let botToBot = Vec2.fromPointToPoint(vertices[1], vertices[3]);
            expect(Vec2.length(topToTop)).approximately(Vec2.length(botToBot), e);
            expect(Vec2.equals(Vec2.normalize(topToTop), Vec2.normalize(botToBot), e));
        })

        it('separates the new top and bottom vertex by the desired thickness, with the new point in the middle', () => {
            let top = stroke.vertices[2];
            let bot = stroke.vertices[3];
            expect(Point.distance(top, bot)).approximately(width, e);
            expect(Point.equals(Point.midpoint(top, bot), p0));
        })

        it('extends the previous line if the length of the resulting line would still be <= the desired thickness', () => {
            let p2 = {x: 6, y: 6};
            let p3 = {x: 7, y: 6};
            stroke.lineTo(p2, width);
            expect(vertices.length).to.equal(6);
            stroke.lineTo(p3, width);
            expect(vertices.length).to.equal(6);
        });
    })
})