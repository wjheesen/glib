import { Point, Vec2 } from "..";

export interface Like {
    /** The left boundary of this Rect */
    left: number;
    /** The top boundary of this Rect */
    top: number;
    /** The right boundary of this Rect */
    right: number;
    /** The bottom boundary of this Rect */
    bottom: number;
}

/** Copies a rect */
export function copy(r: Like, out = <Like> {}) {
    out.left = r.left;
    out.top = r.top;
    out.right = r.right;
    out.bottom = r.bottom;
    return out;
}

/** Creates an empty rect */
export function empty(out = <Like> {}) {
    out.left = 0;
    out.top = 0;
    out.right = 0;
    out.bottom = 0;
    return out;
}

/** Creates a rect with the specified dimensions */
export function dimensions(left: number, top: number, width: number, height: number, out = <Like> {}) {
    out.left = left;
    out.top = top;
    out.right = left + width;
    out.bottom = top - height;
    return out;
}

 /** Measures the width of a rect */
export function width(r: Like) {
    return r.right - r.left;
}

/** Measures the height of a rect */
export function height(r: Like) {
    return r.top - r.bottom;
}

export function aspect(r: Like) {
    return width(r) / height(r);
}

/** Measures the area of a rect */
export function area(r: Like) {
    return width(r) * height(r);
}

/** Measures the point at the center of a rect */
export function center(r: Like, out = <Point.Like> {}) {
    out.x = centerX(r);
    out.y = centerY(r);
    return out;
}

/** Measures the x-coordinate of the point at the center of a rect */
export function centerX(r: Like) {
    return 0.5 * (r.left + r.right);
}

/** Measures the y-coordinate of the point at the center of a rect */
export function centerY(r: Like) {
    return 0.5 * (r.bottom + r.top);
}

/** Gets the point at the top left corner of a rect */
export function topLeft(r: Like, out = <Point.Like> {}) {
    out.x = r.left;
    out.y = r.top;
    return out;
}

/** Gets the point at the bottom left corner of a rect */
export function bottomLeft(r: Like, out = <Point.Like> {}) {
    out.x = r.left;
    out.y = r.bottom;
    return out;
}

/** Gets the point at the bottom right corner of a rect */
export function bottomRight(r: Like, out = <Point.Like> {}) {
    out.x = r.right;
    out.y = r.bottom;
    return out;
}

/** Gets the point at the top right corner of a rect */
export function topRight(r: Like, out = <Point.Like> {}) {
    out.x = r.right;
    out.y = r.top;
    return out;
}

/** Checks if a rect is empty. True if left >= right or bottom >= top. */
export function isEmpty(r: Like) {
    return r.left >= r.right || r.bottom >= r.top;
}

/** Checks if the boundaries of this Rect represent a valid rectangle. True if right >= left and top >= bottom. */
export function isValid(r: Like) {
    return r.right >= r.left && r.top >= r.bottom;
}

/** Finds the union of two rectangles */
export function union(r1: Like, r2: Like, out = <Like> {}) {
    out.left = Math.min(r1.left, r2.left);
    out.right = Math.max(r1.right, r2.right);
    out.bottom = Math.min(r1.bottom, r2.bottom);
    out.top = Math.max(r1.top, r2.top);
    return out;
}

/** Expands a rect to enclose the specified point */
export function unionPoint(r: Like, {x, y}: Point.Like, out = <Like> {}) {
    out.left = Math.min(x, r.left);
    out.top = Math.max(y, r.top);
    out.right = Math.max(x, r.right);
    out.bottom = Math.min(y, r.bottom);
    return out;
}

/** Checks if two rectangles intersect */
export function intersects(r1: Like, r2: Like) {
    return r1.right >= r2.left && r2.right >= r1.left && r1.top >= r2.bottom && r2.top >= r1.bottom;
}

/** Finds the intersection of 2 rectangles */
export function intersect(r1: Like, r2: Like, out = <Like> {}) {
    out.left = Math.max(r1.left, r2.left);
    out.right = Math.min(r1.right, r2.right);
    out.bottom = Math.max(r1.bottom, r2.bottom);
    out.top = Math.min(r1.top, r2.top);
    return out;
}

/** Insets the boundaries of a rect by the specified vector. */
export function inset(r: Like, {x, y}: Vec2.Like, out = <Like> {}) {
    out.left = r.left + x;
    out.top = r.top - y;
    out.right = r.right - x;
    out.bottom = r.bottom + y;
    return out;
}

/** Offsets the position of a rect by the specified vector */
export function offset(r: Like, {x, y}: Vec2.Like, out = <Like> {}) {
    out.left = r.left + x;
    out.top = r.top + y;
    out.right = r.right + x;
    out.bottom = r.bottom + y;
    return out;
}

/** Offsets the position of a rect by the specified change in x (dx) */
export function offsetX(r: Like, dx: number, out = <Like> {}) {
    return offset(r, {x: dx, y: 0}, out);
}

/** Offsets the position of a rect by the specified change in y (dy) */
export function offsetY(r: Like, dy: number, out = <Like> {}) {
    return offset(r, {x: 0, y: dy}, out);
}

/** Checks if r1 contains r2 */
export function contains(r1: Like, r2: Like) {
    return r1.left <= r2.left && r2.right <= r1.right &&
        r1.bottom <= r2.bottom && r2.top <= r1.top;
}

/** Checks if a rect contains the specified point */
export function containsPoint(r: Like, {x, y}: Point.Like) {
    return containsX(r, x) && containsY(r, y);
}

/** Checks if a rect contains any point with the specified x coordinate  */
export function containsX(r: Like, x: number) {
    return r.left <= x && x <= r.right;
}

/** Checks if a rect contains any point with the specified y coordinate  */
export function containsY(r: Like, y: number) {
    return r.bottom <= y && y <= r.top;
}

/** Swaps the top/bottom or left/right boundaries of a rect if they are flipped, meaning left > right and/or top > bottom */
export function sort({top, left, bottom, right}: Like, out = <Like> {}) {
    let vFlipped = bottom > top;
    let hFlipped = left > right;
    out.top = vFlipped ? bottom : top;
    out.left = hFlipped ? right : left;
    out.bottom = vFlipped ? top : bottom;
    out.right = hFlipped ? left : right;
    return out;
}

/** Checks if r1 and r2 are approximately equal */
export function equals(r1: Like, r2: Like, e = 0) {
    return Math.abs(r1.left - r2.left) <= e
        && Math.abs(r1.top - r2.top) <= e
        && Math.abs(r1.right - r2.right) <= e
        && Math.abs(r1.bottom - r2.bottom) <= e;
}
