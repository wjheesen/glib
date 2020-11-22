import { PointLike } from "./point";
import { cross, divide, dot, fromPointToPoint, length, normalize, rotate180, Vec2Like } from "./vec2";
import { center, height, width, RectLike, empty, unionPoint, bottomLeft, topRight, bottomRight, topLeft, dimensions } from "./rect";

export interface Mat2dLike {
    /** The first entry in the first column of this Mat2d */
    c1r1: number;
    /** The second entry in the first column of this Mat2d */
    c1r2: number;
    /** The first entry in the second column of this Mat2d */
    c2r1: number;
    /** The second entry in the second column of this Mat2d */
    c2r2: number;
    /** The first entry in the third column of this Mat2d */
    c3r1: number;
    /** The second entry in the third column of this Mat2d */
    c3r2: number;
}

/** Copies a 2d matrix */
export function copy(m: Mat2dLike, out = <Mat2dLike> {}) {
    out.c1r1 = m.c1r1; out.c2r1 = m.c2r1; out.c3r1 = m.c3r1;
    out.c1r2 = m.c1r2; out.c2r2 = m.c2r2; out.c3r2 = m.c3r2;
    return out;
}

/** Inverts a 2d matrix. */
export function invert(m: Mat2dLike, out = <Mat2dLike> {}){
    let det = determinant(m);
    let { c1r1, c2r1, c3r1, c1r2, c2r2, c3r2 } = m;
    out.c1r1 = c2r2 / det;
    out.c2r1 = -c2r1 / det;
    out.c3r1 = ((c2r1 * c3r2) - (c3r1 * c2r2)) / det;
    out.c1r2 = -c1r2 / det;
    out.c2r2 = c1r1 / det;
    out.c3r2 = ((c1r2 * c3r1) - (c1r1 * c3r2)) / det;
    return out;
}

/** Computes the determinant of a 2d matrix. */
export function determinant(m: Mat2dLike) {
    return (m.c1r1 * m.c2r2) - (m.c2r1 * m.c1r2);
}

/** Concatenates 2 matrices together by multiplication: left * right */
export function concat(left: Mat2dLike, right: Mat2dLike, out = <Mat2dLike> {}) {
    // Calculate the first row, fixing the first left hand row
    // and moving across each of the right hand columns
    let c1r1 = left.c1r1 * right.c1r1 + left.c2r1 * right.c1r2;
    let c2r1 = left.c1r1 * right.c2r1 + left.c2r1 * right.c2r2;
    let c3r1 = left.c1r1 * right.c3r1 + left.c2r1 * right.c3r2 + left.c3r1;
    // Calculate the second row, fixing the second left hand row
    // and moving across each of the right hand columns
    let c1r2 = left.c1r2 * right.c1r1 + left.c2r2 * right.c1r2;
    let c2r2 = left.c1r2 * right.c2r1 + left.c2r2 * right.c2r2;
    let c3r2 = left.c1r2 * right.c3r1 + left.c2r2 * right.c3r2 + left.c3r2;
    // Output the result
    out.c1r1 = c1r1; out.c2r1 = c2r1; out.c3r1 = c3r1;
    out.c1r2 = c1r2; out.c2r2 = c2r2; out.c3r2 = c3r2;
    return out;
}

/** Pivots the fixed point of a matrix by the specified vector */
export function pivot(m: Mat2dLike, v: PointLike, out = <Mat2dLike> {}) {
    return conjugate(m, translate(v), out);
}

/** Conjugates a matrix by the specified conjugator matrix */
export function conjugate(m: Mat2dLike, conjugator: Mat2dLike, out = <Mat2dLike> {}) {
    return concat(conjugator, concat(m, invert(conjugator)), out);
}

/** Creates an identity matrix */
export function identity(out = <Mat2dLike> {}) {
    out.c1r1 = 1; out.c2r1 = 0; out.c3r1 = 0;
    out.c1r2 = 0; out.c2r2 = 1; out.c3r2 = 0;
    return out;
}

/** Creates a matrix to translate by the specified vector */
export function translate({x, y}: Vec2Like, out = <Mat2dLike> {}) {
    out.c1r1 = 1; out.c2r1 = 0; out.c3r1 = x;
    out.c1r2 = 0; out.c2r2 = 1; out.c3r2 = y;
    return out;
}

/** Creates a matrix to scale by the specified vector */
export function scale({x, y}: Vec2Like, out = <Mat2dLike> {}) {
    out.c1r1 = x; out.c2r1 = 0; out.c3r1 = 0;
    out.c1r2 = 0; out.c2r2 = y; out.c3r2 = 0;
    return out;
}

/** Creates a matrix to scale from the specified start point to the specified end point, with a pivot point at p. */
export function scaleToPoint(start: PointLike, end: PointLike, p: PointLike, out = <Mat2dLike> {}) {
    let v1 = fromPointToPoint(p, start);
    let v2 = fromPointToPoint(p, end);
    let s = scale({x: v2.x / v1.x, y: v2.y / v1.y}, out);
    return pivot(s, p, out);
}

/** Creates a matrix to scale by the specified factor */
export function stretch(factor: number, out = <Mat2dLike> {}) {
    return scale({x: factor, y: factor}, out); 
}

/** Creates a matrix to rotate by the specified number of radians */
export function rotate(radians: number, out = <Mat2dLike> {}) {
    return sinCos(Math.sin(radians), Math.cos(radians), out);
}

/** Creates a matrix to stretch and rotate from the specified start point to the specified end point, with a pivot point at p. */
export function stretchRotateToPoint(start: PointLike, end: PointLike, p: PointLike, out = <Mat2dLike> {}) {
    // Determine the stretch ratio
    let v1 = fromPointToPoint(p, start);
    let v2 = fromPointToPoint(p, end);
    let l1 = length(v1);
    let l2 = length(v2);
    let s = stretch(l2 / l1);

    // Determine the sin and cos of the rotation angle
    let n1 = divide(v1, l1);
    let n2 = divide(v2, l2);
    let sin = cross(n1, n2);
    let cos = dot(n1, n2);
    let r = sinCos(sin, cos);

    // Rotate first, then stretch
    return pivot(concat(s, r), p, out);
}

/** Creates a matrix to rotate by the specified sine and cosine values */
export function sinCos(sin: number, cos: number, out = <Mat2dLike> {}) {
    out.c1r1 = cos; out.c2r1 = -sin; out.c3r1 = 0;
    out.c1r2 = sin; out.c2r2 = cos; out.c3r2 = 0;
    return out;
}

/** Scale to fit options for a rect-to-rect matrix. */
export const enum ScaleToFit {
    /** Stretches the src rect to fit inside dst, then centers the src rect inside the dst rect */
    Center,
    /** Stretches the src rect to fit inside dst, then translates the src rect to the bottom right corner of the dst rect */
    End,
    /** Scales the src rect to fit inside dst exactly, then translates src to dst */
    Fill,
    /** Stretches the src rect to fit inside dst, then translates the src rect to top left corner of the dst rect*/
    Start
};

/** Creates a matrix to map src into dst using the specifed scale to fit option  */
export function rectToRect(src: RectLike, dst: RectLike, stf = ScaleToFit.Fill, out = <Mat2dLike> {}) {
    // Translate to origin
    let origin = {x: 0, y: 0};
    let srcPoint = getScaleToFitPoint(src, stf);
    let dstPoint = getScaleToFitPoint(dst, stf);
    translate(fromPointToPoint(srcPoint, origin), out); 

    // Apply the scale
    let sx = width(dst) / width(src);
    let sy = height(dst) / height(src);
    let scaleMatrix = stf == ScaleToFit.Fill ? scale({x: sx, y: sy}) : stretch(Math.min(sx, sy));
    concat(scaleMatrix, out, out);

    // Translate to destination point
    let translation = translate(fromPointToPoint(origin, dstPoint));
    return concat(translation, out, out);
}

/** Determine which point to match based on the scale to fit option. */
function getScaleToFitPoint(r: RectLike, stf: ScaleToFit): PointLike {
    switch (stf) {
        case ScaleToFit.Center:
            return center(r);
        case ScaleToFit.End:
            return {x: r.right, y: r.bottom};
        default:
            return {x: r.left, y: r.top};
    }
}

/** Maps a point by the specified matrix */
export function mapPoint(m: Mat2dLike, {x, y}: PointLike, out = <PointLike> {}) {
    out.x = m.c1r1 * x + m.c2r1 * y + m.c3r1;
    out.y = m.c1r2 * x + m.c2r2 * y + m.c3r2;
    return out;
}

/** Maps a rect by the specified matrix */
export function mapRect(m: Mat2dLike, r: RectLike, out = <RectLike> {}) {
    let {x, y} = mapPoint(m, topLeft(r)); 
    dimensions(x, y, 0, 0, out);
    for (let corner of [bottomLeft(r), bottomRight(r), topRight(r)]) {
        unionPoint(out, mapPoint(m, corner), out);
    }
    return out;
}

/** Checks if two matrices are approximately equal */
export function equals(m1: Mat2dLike, m2: Mat2dLike, e = 0) {
    return Math.abs(m1.c1r1 - m2.c1r1) <= e
        && Math.abs(m1.c1r2 - m2.c1r2) <= e
        && Math.abs(m1.c2r1 - m2.c2r1) <= e
        && Math.abs(m1.c2r2 - m2.c2r2) <= e
        && Math.abs(m1.c3r1 - m2.c3r1) <= e
        && Math.abs(m1.c3r2 - m2.c3r2) <= e
}