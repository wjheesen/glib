import { expect } from 'chai';
import { PolygonMesh, Point, Rect, Vec2, Vec2Buffer } from '..';

describe('PolygonMesh', () => {
    
    describe('#regularVertices()', () => {    
        let triangle = PolygonMesh.regularVertices(3);
        it('has one vertex for each side of the polygon', () => {
            expect(triangle.length).to.equal(3);
        })
        it('if the pointy-top option is specified, it starts with a vertex at (0,1)', () => {
            expect(Vec2.equals(triangle.at(0), {x: 0, y: 1})).to.be.true;
        })
        it('if the flat-top option is specified, a horizontal line can be drawn through the first and last vertex', () => {
            let flatHex = PolygonMesh.regularVertices(6, true);
            let line = Vec2.fromPointToPoint(flatHex.get(0), flatHex.get(flatHex.length - 1));
            expect(line.y).equals(0);
        })
        it('has an equal distance (of 1) between each of its vertices and the origin', () => {
            let origin = {x: 0, y: 0};
            for (let i = 0; i < triangle.length; i++) {
                expect(Point.distance(origin, triangle.at(i))).approximately(1, 0.0001);
            }
        })
    })

    describe('#regularIndices()', () => {
        it('takes 3 indices for a triangle', () => {
            expect(PolygonMesh.regularIndices(3).length).to.equal(3);
        })
        it('takes 12 (3*n - 2) indices for a hexagon', () => {
            expect(PolygonMesh.regularIndices(6).length).to.equal(12);
        })
    })

    describe('#rectangle()', () => {
        let bounds = Rect.dimensions(0, 5, 5, 5);
        let rectangle = PolygonMesh.rectangle(bounds);
        it('is bounded by the original rect', () => {
            expect(rectangle.bounds).deep.equals(bounds);
        })
        it('has the same indices as a square', () => {
            expect(rectangle.indices).deep.equals(PolygonMesh.regularPolygon(4).indices);
        })
    })

    describe('#star()', () => {
        let n = 5;
        let r = 0.6;
        let star = PolygonMesh.star(n, 0.6);
        let origin: Point.Like = {x: 0, y: 0};
        it ('has one point for each inner vertex and one point for each outer vertex', () => {
            expect(star.vertices.length).to.equal(2 * n);
        })
        it ('has an equal distance (of 1) between the origin and each outer vertex', () => {
            for (let i = 0; i < star.vertices.length; i+=2) {
                expect(Point.distance(origin, star.vertices.at(i))).approximately(1, 0.0001);
            }
        })
        it ('has an equal distance (of radius r) between the origin and each inner vertex', () => {
            for (let i = 1; i < star.vertices.length; i+=2) {
                expect(Point.distance(origin, star.vertices.at(i))).approximately(r, 0.0001);
            }
        });
        it ('takes 2(n-1) triangles for a star with n points', () => {
            expect(star.indices.length / 3).to.equal(2 * (n - 1));
        })
    })

    describe('#miters()', () => {
        let bounds = Rect.dimensions(0, 0, 12, 4);
        let rectangle = PolygonMesh.rectangleVertices(bounds);
        let miters = PolygonMesh.miters(rectangle);
        
        it ('can be used to create a border for a polygon', () => {
            let border = Vec2Buffer.withLength(rectangle.length);
            for (let i = 0; i < miters.length; i++) {
                Vec2.add(miters.at(i), rectangle.at(i), border.at(i));
            }
            expect(border.bounds.contains(rectangle.bounds)).to.be.true;
            expect(border.bounds.area).to.be.greaterThan(rectangle.bounds.area);
        });
    });
})