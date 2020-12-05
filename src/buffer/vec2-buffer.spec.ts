import { expect } from 'chai';
import { Rect, Vec2, Vec2Buffer, PolygonMesh } from '..';

describe('Vec2Buffer', () => {
    let buffer = new Vec2Buffer(new Float32Array([1,2,3,4,5,6,7,8]));

    it('requires 2 floats for each Vec2', () => {
        expect(buffer.componentLength).equals(2);
        expect(buffer.length).equals(buffer.data.length / 2);
    })

    it('correctly returns the Vec2 at a given index', () => {
        expect(Vec2.equals(buffer.get(0), {x: 1, y: 2})).to.be.true;
        expect(Vec2.equals(buffer.get(1), {x: 3, y: 4})).to.be.true;
        expect(Vec2.equals(buffer.get(2), {x: 5, y: 6})).to.be.true;
        expect(Vec2.equals(buffer.get(3), {x: 7, y: 8})).to.be.true;
    })

    it('can be modified by changing one of the components in the underlying float array', () => {
        buffer.data[0] = -1;
        buffer.data[1] = -2;
        expect(buffer.get(0).x).equals(-1);
        expect(buffer.get(0).y).equals(-2);
    })

    it('can be modified by positioning the buffer at the desired index and changing one of its components ', () => {
        buffer.position = 1;
        buffer.x = -3;
        buffer.y = -4;
        expect(buffer.data[2]).equals(-3);
        expect(buffer.data[3]).equals(-4);
    })

    it('can be modified by getting a Vec2 from the buffer and changing one of its components', () => {
        buffer.get(3).x = -7;
        buffer.get(3).y = -8;
        expect(buffer.data[6]).equals(-7);
        expect(buffer.data[7]).equals(-8);
    })

    it('throws an exception if a requested index is out of bounds',  () => {
        expect(() => buffer.get(-1)).to.throw;
        expect(() => buffer.get(buffer.length)).to.throw;
        expect(() => buffer.position = -1).to.throw;
        expect(() => buffer.position = buffer.length).to.throw;
    });

    describe('bounds', () => {
        it('should be empty if the buffer is empty', () => {
            let emptyBuffer = new Vec2Buffer(new Float32Array([]))
            let bounds = emptyBuffer.bounds;
            expect(Rect.isEmpty(bounds)).to.be.true;
        });

        it('contains all of the the points in the buffer', () => {
            let bounds = buffer.bounds;
            for (let i = 0; i < buffer.length; i++) {
                expect(Rect.containsPoint(bounds, buffer.at(i)));
            }
        });

        it('should return a matching rect if the vertices are created using the 4 corners of a rect', () => {
            let r = Rect.dimensions(3, 7, 12, 14);

            let vertices = new Vec2Buffer(new Float32Array([
                r.left, r.top,
                r.left, r.bottom,
                r.right, r.bottom,
                r.right, r.top,
            ]));

            expect(vertices.bounds).deep.equals(r);
        });
    })

    describe('containsPoint', () => {
        let hex = PolygonMesh.regularVertices(6);

        it('does not include points on the edge of the polygon', () => {
            for (let i = 0; i < buffer.length; i++) {
                expect(hex.containsPoint(buffer.get(i))).to.be.false;
            }
        })

        it('does not include points outside of the polygon', () => {
            expect(hex.containsPoint({x: 2, y: 2})).to.be.false;
        })

        it('returns true for points inside the polygon', () => {
            console.log(hex);
            expect(hex.containsPoint({x: 0, y: 0})).to.be.true;
            expect(hex.containsPoint({x: 0, y: 0.9})).to.be.true;
            expect(hex.containsPoint({x: 0, y: -0.9})).to.be.true;
            expect(hex.containsPoint({x: 0.7, y:0})).to.be.true;
            expect(hex.containsPoint({x: -0.7, y:0})).to.be.true;
        })
    })
})