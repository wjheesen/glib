import { Color, StructBuffer } from '..';

export class ColorBuffer extends StructBuffer<Uint8Array, Color.Like> implements Color.Like {

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

    protected newStruct(data: Uint8Array): Color.Like {
        return new ColorBuffer(data);
    }
} 
