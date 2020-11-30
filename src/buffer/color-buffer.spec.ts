import { expect } from 'chai';
import { Color, ColorBuffer } from '..';

describe('ColorBuffer', () => {
    let c0 = Color.random();
    let c1 = Color.random();
    let c2 = Color.random();

    let buffer = new ColorBuffer(new Uint8Array(12));
    Color.copy(c0, buffer.at(0));
    Color.copy(c1, buffer.at(1));
    Color.copy(c2, buffer.at(2));

    it('requires 4 bytes for each color', () => {
        expect(buffer.componentLength).equals(4);
        expect(buffer.length).equals(buffer.data.length / 4);
    })

    it('correctly returns the color at a given index', () => {
        expect(Color.equals(buffer.get(0), c0)).to.be.true;
        expect(Color.equals(buffer.get(1), c1)).to.be.true;
        expect(Color.equals(buffer.get(2), c2)).to.be.true;
    })
})