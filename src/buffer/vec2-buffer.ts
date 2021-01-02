import { Point, Vec2, StructBuffer, Rect } from '..';

export class Vec2Buffer extends StructBuffer<Float32Array, Vec2.Like> implements Vec2.Like {

    /** Creates a vec2 buffer large enough to hold the specified number of vec2s. */
    static withLength(n: number) {
        return new this(new Float32Array(n * 2));
    }

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

    get bounds(): Rect
    {
        return this.length == 0 ? Rect.empty() : this.measureBounds(this.at(0));
    }

    /** Algorithm used when buffer contains at least one point (p0) */
    private measureBounds(p0: Point.Like)
    {
        let bounds = Rect.dimensions(p0.x, p0.y, 0, 0);
        for (let i = 1; i < this.length; i++) {
            bounds.unionPoint(this.at(i));
        }
        return bounds;
    }

    protected newStruct(data: Float32Array): Vec2.Like {
        return new Vec2Buffer(data);
    }

    /**
     * Checks if a polygon (specified by a subset of vertices in this buffer) contains the specified point.
     * @param x the x coordinate of the point to check.
     * @param y the y coordinate of the point to check.
     * @param offset the offset of the first polygon vertex. Defaults to zero.
     * @param count the number of polygon vertices. Defaults to the number of vertices in this buffer.
     */
    containsPoint(p: Point.Like, offset = 0, count = this.length - offset) {
        // Assume the point is not inside the polygon
        let inside = false;

        // Check point against each side of the polygon 
        let {x: x1, y: y1} = this.at(offset + count - 1);
        while(count-- > 0){
            let {x: x2, y: y2 } = this.at(offset++);
            if((y1 > p.y) !== (y2 > p.y) && p.x < (x2 - x1) * (p.y - y1) / (y2 - y1) + x1){
                inside = !inside; 
            }
            x1 = x2; y1 = y2;
        }

        return inside;
    }
}
