import * as pt from "./point";
import { add, dot, fromPointToPoint, length2, multiply } from "./vec2";

/** Line segment from p1 to p2 */
export interface LineSegmentLike {
    /** The point at one end of this line segment */
    p1: pt.PointLike;
    /** The point at the other end of this line segment */
    p2: pt.PointLike;
}

/** Copies a line segment */
export function copy(l: LineSegmentLike, out = <LineSegmentLike> {}) {
    out.p1 = pt.copy(l.p1, out.p1);
    out.p2 = pt.copy(l.p2, out.p2);
    return out;
}

/** Checks if the distance from this line to (x,y) is less than or equal to epsilon  */
export function containsPoint(l: LineSegmentLike, p: pt.PointLike, epsilon = 0) {
    // Paramaterize the line segment to a + bt, 0<=t<=1
    let a = l.p1,
        b = fromPointToPoint(l.p1, l.p2),
        t = -1;

    // Find the value of t that produces a point closest to point p (using vector projection)
    let v = fromPointToPoint(a, p);
    let len2 = length2(b);
    if (len2 != 0) { //in case of 0 length line
        t = dot(b, v) / len2;
    }

    // If t does not produce a point on our line segment, then then the line segment does not contain the point
    if (t < 0 || t > 1) {
        return false;
    }

    // The distance between the given point and specified point must be less than epsilon
    // As an optimization, we check distance squared to avoid having to take the square root
    let closest = add(a, multiply(b, t));
    let dist2 = pt.distance2(closest, p);
    return dist2 <= (epsilon * epsilon);
}

/** Checks if l1 and l2 are approximately equal */
export function equals(l1: LineSegmentLike, l2: LineSegmentLike, e = 0) {
    return pt.equals(l1.p1, l2.p1, e) 
        && pt.equals(l1.p2, l2.p2, e);
}

