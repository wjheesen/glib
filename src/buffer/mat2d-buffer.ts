import { Mat2d, StructBuffer } from '..';

export class Mat2dBuffer extends StructBuffer<Float32Array, Mat2d.Like> implements Mat2d.Like {

    get componentLength() {
        return 6;
    }

    get c1r1() { 
        return this.getComponent(0);
    }

    set c1r1(value: number) {
        this.setComponent(0, value);
    }

    get c1r2() { 
        return this.getComponent(1);
    }

    set c1r2(value: number) {
        this.setComponent(1, value);
    }

    get c2r1() { 
        return this.getComponent(2);
    }

    set c2r1(value: number) {
        this.setComponent(2, value);
    }

    get c2r2() { 
        return this.getComponent(3);
    }

    set c2r2(value: number) {
        this.setComponent(3, value);
    }

    get c3r1() { 
        return this.getComponent(4);
    }

    set c3r1(value: number) {
        this.setComponent(4, value);
    }

    get c3r2() { 
        return this.getComponent(5);
    }

    set c3r2(value: number) {
        this.setComponent(5, value);
    }

    protected newStruct(data: Float32Array): Mat2d.Like {
        return new Mat2dBuffer(data);
    }
} 
