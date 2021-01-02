import { Point, Rect, Vec2 } from "..";

export interface Like {
    /** The semi x axis of this ellipse, that is, the distance from the center of this ellipse to its left and right vertices. */
    rx: number;
    /**  The semi y axis of this ellipse, that is, the distance from the center of this ellipse to its top and bottom vertices. */
    ry: number;
    /** The point at the center of this ellipse. */
    c: Point.Like;
}

/** Copies an ellipse */
export function copy(e: Like, out = <Like> {}) {
    out.rx = e.rx;
    out.ry = e.ry;
    out.c = Point.copy(e.c, out.c);
    return out;
}

/** Creates a circle with radius r centered at point c */
export function circle(r: number, c: Point.Like, out = <Like> {}) {
    return copy({rx: r, ry: r, c: c}, out);
}

/** Creates an ellipse with the specified boundaries */
export function fromRect(r: Rect, out = <Like> {}) {
    return copy({rx: r.width / 2, ry: r.height / 2, c: r.center()}, out);
}

/** Check if an ellipse contains the specified point */
export function containsPoint(e: Like, p: Point.Like) {
    // Similar to point in circle problem, but need to account for x/y axes
    let d = Vec2.fromPointToPoint(p, e.c); 
    let sx = d.x / e.rx;
    let sy = d.y / e.ry;
    return (sx * sx) + (sy * sy) <= 1;
}

/** Checks if e1 and e2 are approximately equal */
export function equals(e1: Like, e2: Like, e = 0) {
    return Math.abs(e1.rx - e2.rx) <= e
        && Math.abs(e1.ry - e2.ry) <= e
        && Point.equals(e1.c, e2.c, e);
}
 