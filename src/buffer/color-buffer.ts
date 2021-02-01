import { Color, StructBuffer } from '..';
import { TypedArray } from './typed-array';

export type ColorfBuffer = ColorBuffer<Float32Array>;

export class ColorBuffer<T extends TypedArray> extends StructBuffer<T, Color.Like> implements Color.Like {

    /** Creates a color buffer large enough to hold the specified number of colors. */
    static withLength(n: number) {
        return new this(new Uint8Array(n * 4));
    }

    get componentLength() {
        return 4;
    }

    get r() { 
        return this.getComponent(0);
    }

    set r(value: number) {
        this.setComponent(0, value);
    }

    get g() { 
        return this.getComponent(1);
    }

    set g(value: number) {
        this.setComponent(1, value);
    }

    get b() { 
        return this.getComponent(2);
    }

    set b(value: number) {
        this.setComponent(2, value);
    }

    get a() { 
        return this.getComponent(3);
    }

    set a(value: number) {
        this.setComponent(3, value);
    }

    protected newStruct(data: T): Color.Like {
        return new ColorBuffer(data);
    }
} 
