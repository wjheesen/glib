import { Point, Rect } from "..";

/** A two-dimensional vector with (x,y) components */
export interface Like {
    x: number;
    y: number;
}

/** Copies a */
export function copy(v: Like, out = <Like> {}) {
    out.x = v.x;
    out.y = v.y;
    return out;
}

/** Returns v1 + v2 (component-wise addition) */
export function add(v1: Like, v2: Like, out = <Like> {}) {
    out.x = v1.x + v2.x;
    out.y = v1.y + v2.y;
    return out;
}

/** Returns v1 - v2 (component-wise subtraction) */
export function subtract(v1: Like, v2: Like, out = <Like> {}) {
    out.x = v1.x - v2.x;
    out.y = v1.y - v2.y;
    return out;
}

/** Multiplies each component of a vector by the specified factor */
export function multiply({x, y}: Like, factor: number, out = <Like> {}) {
    out.x = x * factor;
    out.y = y * factor;
    return out;
}

/** Divides each component of a vector by the specified factor */
export function divide({x, y}: Like, factor: number, out = <Like> {}) {
    out.x = x / factor;
    out.y = y / factor;
    return out;
}

/** Measures the length of a vector */
export function length(v: Like) {
    return Math.sqrt(length2(v));
}

/** Measures the length squared of a vector */
export function length2({x, y}: Like) {
    return x * x + y * y;
}

/** Computes the dot product of v1 and v2 */
export function dot(v1: Like, v2: Like) {
    return v1.x * v2.x + v1.y * v2.y;
}

/** Computes the cross product of v1 with v2. */
export function cross(v1: Like, v2: Like) {
    return (v1.x * v2.y) - (v2.x * v1.y);
}
 
/* Normalizes a vector so that it has a length of 1 */
export function normalize(v: Like, out = <Like> {}) {
    return divide(v, length(v), out);
}

/** Rotates a vector 90 degrees CCW (to the right) */
export function rotate90({x, y}: Like, out = <Like> {}) {
    out.x = y;
    out.y = -x;
    return out;
}

/** Rotates a vector 180 degrees CCW (flipping it) */
export function rotate180({x, y}: Like, out = <Like> {}) {
    out.x = -x;
    out.y = -y;
    return out;
}

/** Rotates a vector 270 degrees CCW (90 degree to the left) */
export function rotate270({x, y}: Like, out = <Like> {}) {
    out.x = -y;
    out.y = x;
    return out;
}

/** Measures the vector from p1 (initial point) to p2 (terminal point) */
export function fromPointToPoint(p1: Point.Like, p2: Point.Like, out = <Like> {}) {
    out.x = p2.x - p1.x;
    out.y = p2.y - p1.y;
    return out;
}

/** Bounds a translation vector to prevent it from mapping point p outside of bounds r */
export function bound(v: Like, p: Point.Like, b: Rect, out = <Like> {}) {
    out.x = boundX(v.x, p.x, b);
    out.y = boundY(v.y, p.y, b);
    return out;
}

/** Bounds the x-component of a translation vector to prevent it from mapping the x-coordinate of a point outside of bounds b */
export function boundX(dx: number, x: number, b: Rect) {
    let targetX = dx + x;
    let side = dx < 0 ? b.left : b.right;
    return b.containsX(targetX) ? dx : side - x;
}

/** Bounds the y-component of a translation vector to prevent it from mapping the y-coordinate of a point outside of bounds b */
export function boundY(dy: number, y: number, b: Rect) {
    let targetY = dy + y;
    let side = dy < 0 ? b.bottom : b.top;
    return b.containsY(targetY) ? dy : side - y;
}

/**
 * Finds the miter vector needed to join the two specified lines. Assumes the lines are measured from points listed in CCW order.
 * @param line1 The nonzero vector from the start of the first line to the end of the first line. 
 * @param line2 The nonzero vector from the start of the second line to the end of the second line. 
 * @param lineWidth The width of the second line (or half the width, if joining at the center of the lines).
 * @param miterLimit The maximum allowable miter length before a bevel is applied. Usually some multiple of lineWidth.
 */
export function miter(line1: Like, line2: Like, lineWidth: number, miterLimit: number, out = <Like> {}){
    let n1 = normalize(rotate90(line1));
    let n2 = normalize(rotate90(line2));
    let direction = normalize(add(n1, n2));
    let length = Math.min(miterLimit, lineWidth / dot(direction, n2));
    return multiply(direction, length, out);
}

/** Checks if v1 and v2 are approximately equal */
export function equals(v1: Like, v2: Like, e = 0) {
    return Math.abs(v1.x - v2.x) <= e
        && Math.abs(v1.y - v2.y) <= e;
}