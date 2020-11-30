import { expect } from 'chai';
import { Mat2d, Mat2dBuffer } from '..';

describe('Mat2dBuffer', () => {
    let e = 0.000001;
    let r = Mat2d.rotate(Math.PI / 6);
    let s = Mat2d.scale({x:3, y: 5});
    let t = Mat2d.translate({x:12, y: -8});

    let buffer = new Mat2dBuffer(new Float32Array(18));
    Mat2d.copy(r, buffer.at(0));
    Mat2d.copy(s, buffer.at(1));
    Mat2d.copy(t, buffer.at(2));

    it('requires 6 floats for each matrix', () => {
        expect(buffer.componentLength).equals(6);
        expect(buffer.length).equals(buffer.data.length / 6);
    })

    it('correctly returns the matrix at a given index', () => {
        expect(Mat2d.equals(buffer.get(0), r, e)).to.be.true;
        expect(Mat2d.equals(buffer.get(1), s, e)).to.be.true;
        expect(Mat2d.equals(buffer.get(2), t, e)).to.be.true;
    })
})