import { Point, Vec2 } from "..";

export class LineSegment {
    constructor(
        /** The point at one end of this line segment */
        public p1: Point.Like, 
        /** The point at the other end of this line segment */
        public p2: Point.Like
    ) {}

    get midpoint() {
        return Point.midpoint(this.p1, this.p2);
    }

    get length() {
        return Point.distance(this.p1, this.p2);
    }

    /** Checks if the distance from this line to (x,y) is less than or equal to epsilon  */
    containsPoint(p: Point.Like, epsilon = 0) {
        // Paramaterize the line segment to a + bt, 0<=t<=1
        let a = this.p1,
            b = Vec2.fromPointToPoint(this.p1, this.p2),
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

    /** Copies a line segment */
    copy() {
        return new LineSegment(Point.copy(this.p1), Point.copy(this.p2));
    }

    /** Checks if l1 and l2 are approximately equal */
    equals(l: LineSegment, e = 0) {
        return Point.equals(this.p1, l.p1, e) 
            && Point.equals(this.p2, l.p2, e);
    }
}
