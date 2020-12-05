import { Point, Rect, Vec2, Vec2Buffer } from "..";

/** Stores static vertex and index data that multiple graphics can share. */
export abstract class Mesh {

    public readonly bounds = this.vertices.bounds;

    constructor(
        /** Vertices in model space, centered at the origin */
        public readonly vertices: Vec2Buffer,
        /** Triangle indices for this mesh */
        public readonly indices: Uint16Array,
    ) {}

    /** Checks if this mesh contains the specified point */
    abstract containsPoint(p: Point.Like): boolean;
}