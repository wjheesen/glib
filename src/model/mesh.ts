import { Point, Rect, Vec2, Vec2Buffer } from "..";

/** Stores static vertex and index data that multiple graphics can share. */
export abstract class Mesh {

    public readonly bounds = this.vertices.bounds;

    public miters?: Vec2Buffer;

    /** The byte offset of this mesh's vertex data in a vertex buffer (if any). */
    public vertexBufferOffset?: number;

    /** The byte offset of this mesh's index data in an element buffer (if any). */
    public indexBufferOffset?: number;

    /** The byte offset of this mesh's stroke vertex data in a vertex buffer (if any). */
    public strokeVertexBufferOffset?: number;

    /** The byte offset of this mesh's stroke index data in an element buffer (if any). */
    public strokeIndexBufferOffset?: number;

    /** The number of indices used to render the stroke (if any). */
    public strokeIndexCount?: number;

    /** The byte offset of this mesh's miter data in an element buffer (if any). */
    public miterBufferOffset?: number;

    constructor(
        /** Vertices in model space, centered at the origin */
        public readonly vertices: Vec2Buffer,
        /** Triangle indices for this mesh */
        public readonly indices?: Uint16Array,
    ) {}

    /** Checks if this mesh contains the specified point */
    abstract containsPoint(p: Point.Like): boolean;
}