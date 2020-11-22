import * as p from "./point";
import { center, height, RectLike, width } from "./rect";
import { fromPointToPoint } from "./vec2";

export interface EllipseLike {
    /** The semi x axis of this ellipse, that is, the distance from the center of this ellipse to its left and right vertices. */
    rx: number;
    /**  The semi y axis of this ellipse, that is, the distance from the center of this ellipse to its top and bottom vertices. */
    ry: number;
    /** The point at the center of this ellipse. */
    c: p.PointLike;
}

/** Copies an ellipse */
export function copy(e: EllipseLike, out = <EllipseLike> {}) {
    out.rx = e.rx;
    out.ry = e.ry;
    out.c = p.copy(e.c, out.c);
    return out;
}

/** Creates a circle with radius r centered at point c */
export function circle(r: number, c: p.PointLike, out = <EllipseLike> {}) {
    return copy({rx: r, ry: r, c: c}, out);
}

/** Creates an ellipse with the specified boundaries */
export function fromRect(r: RectLike, out = <EllipseLike> {}) {
    return copy({rx: width(r) / 2, ry: height(r) / 2, c: center(r)}, out);
}

/** Check if an ellipse contains the specified point */
export function containsPoint(e: EllipseLike, p: p.PointLike) {
    // Similar to point in circle problem, but need to account for x/y axes
    let d = fromPointToPoint(p, e.c); 
    let sx = d.x / e.rx;
    let sy = d.y / e.ry;
    return (sx * sx) + (sy * sy) <= 1;
}

/** Checks if e1 and e2 are approximately equal */
export function equals(e1: EllipseLike, e2: EllipseLike, e = 0) {
    return Math.abs(e1.rx - e2.rx) <= e
        && Math.abs(e1.ry - e2.ry) <= e
        && p.equals(e1.c, e2.c, e);
}
 