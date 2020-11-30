import { TypedArray } from "..";


export abstract class StructBuffer<T extends TypedArray, S> {

    private dataPosition = 0;

    constructor(  
        /** The primitive array data backing the Structs in this buffer.*/
        public readonly data: T,
    ) {}

    /** The current position of this buffer */
    get position() {
        return this.dataPosition / this.componentLength;
    }

    set position(index: number) {
        this.assertValidIndex(index);
        this.dataPosition = index * this.componentLength;
    }

    private assertValidIndex(index: number) {
        if (index < 0 || index >= this.length) {
            throw "Index " + index + " is out of bounds";
        }
    }

    /** @returns this buffer positioned at the specified index */
    at(index: number): this {
        this.position = index;
        return this;
    }

    /** The number of structs in this buffer */
    get length() {
        return this.data.length / this.componentLength;
    }

    /** The number of components making up each struct. */
    abstract get componentLength();

    protected getComponent(index: number) {
        return this.data[this.dataPosition + index];
    }

    protected setComponent(index: number, value: number) {
        return this.data[this.dataPosition + index] = value;
    }

    /** Gets the struct at the specified index. */
    get(index: number): S {
        this.assertValidIndex(index);
        let data = this.getStructData(index);
        return this.newStruct(data);
    }

    protected abstract newStruct(data: T): S

    private getStructData(index: number) {
        let begin = index * this.componentLength;
        let end = begin + this.componentLength;
        return <T> this.data.subarray(begin, end);
    }
}