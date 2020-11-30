import { Vec2 } from "..";

export interface Like {
    x: number;
    y: number;
}

/** Copies a point */
export function copy(p: Like, out = <Like> {}) {
    out.x = p.x;
    out.y = p.y;
    return out;
}

/** Computes the midpoint of p1 and p2 */
export function midpoint(p1: Like, p2: Like, out = <Like> {}) {
    return Vec2.multiply(Vec2.add(p1, p2, out), 0.5, out);
}

/** Computes the distance between p1 and p2 */
export function distance(p1: Like, p2: Like) {
    return Math.sqrt(distance2(p1, p2));
}

/** Computes the distance squared between p1 and p2 */
export function distance2(p1: Like, p2: Like) {
    return Vec2.length2(Vec2.fromPointToPoint(p1, p2));
}

/** Checks if p1 and p2 are approximately equal */
export function equals(p1: Like, p2: Like, e = 0) {
    return Math.abs(p1.x - p2.x) <= e
        && Math.abs(p1.y - p2.y) <= e;
}