import { Point, Vec2 } from "..";

/** Line segment from p1 to p2 */
export interface Like {
    /** The point at one end of this line segment */
    p1: Point.Like;
    /** The point at the other end of this line segment */
    p2: Point.Like;
}

/** Copies a line segment */
export function copy(l: Like, out = <Like> {}) {
    out.p1 = Point.copy(l.p1, out.p1);
    out.p2 = Point.copy(l.p2, out.p2);
    return out;
}

/** Checks if the distance from this line to (x,y) is less than or equal to epsilon  */
export function containsPoint(l: Like, p: Point.Like, epsilon = 0) {
    // Paramaterize the line segment to a + bt, 0<=t<=1
    let a = l.p1,
        b = Vec2.fromPointToPoint(l.p1, l.p2),
        t = -1;

    // Find the value of t that produces a point closest to point p (using vector projection)
    let v = Vec2.fromPointToPoint(a, p);
    let len2 = Vec2.length2(b);
    if (len2 != 0) { //in case of 0 length line
        t = Vec2.dot(b, v) / len2;
    }

    // If t does not produce a point on our line segment, then then the line segment does not contain the point
    if (t < 0 || t > 1) {
        return false;
    }

    // The distance between the given point and specified point must be less than epsilon
    // As an optimization, we check distance squared to avoid having to take the square root
    let closest = Vec2.add(a, Vec2.multiply(b, t));
    let dist2 = Point.distance2(closest, p);
    return dist2 <= (epsilon * epsilon);
}

/** Checks if l1 and l2 are approximately equal */
export function equals(l1: Like, l2: Like, e = 0) {
    return Point.equals(l1.p1, l2.p1, e) 
        && Point.equals(l1.p2, l2.p2, e);
}

