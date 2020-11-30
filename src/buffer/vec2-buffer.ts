import { Vec2, StructBuffer } from '..';

export class Vec2Buffer extends StructBuffer<Float32Array, Vec2.Like> implements Vec2.Like {

    get componentLength() {
        return 2;
    }

    get x() { 
        return this.getComponent(0);
    }

    set x(value: number) {
        this.setComponent(0, value);
    }

    get y() {
        return this.getComponent(1);
    }

    set y(value: number) {
        this.setComponent(1, value);
    }

    protected newStruct(data: Float32Array): Vec2.Like {
        return new Vec2Buffer(data);
    }
} 
