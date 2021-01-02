import { Point, Vec2 } from "..";

export interface RectLike {
    /** The left boundary of this Rect */
    left: number;
    /** The top boundary of this Rect */
    top: number;
    /** The right boundary of this Rect */
    right: number;
    /** The bottom boundary of this Rect */
    bottom: number;
}
export class Rect implements RectLike {

    static copy(r: RectLike) {
        return new Rect(r.left, r.top, r.right, r.bottom);
    }

    /** Creates an empty rect */
    static empty() {
        return new Rect(0, 0, 0, 0);
    }

    /** Creates this rect with the specified dimensions */
    static dimensions(left: number, top: number, width: number, height: number) {
        return new Rect(left, top, left + width, top - height);
    }

    constructor(
        public left: number,
        public top: number,
        public right: number,
        public bottom: number
    ) {}

    /** Measures the width of this rect */
    get width() {
        return this.right - this.left;
    }

    set width(w: number) {
        this.right = this.left + w;
    }

    /** Measures the height of this rect */
    get height() {
        return this.top - this.bottom;
    }

    set height(h: number) {
        this.bottom = this.top - h;
    }

    get aspect() {
        return this.width / this.height;
    }

    /** Measures the area of this rect */
    get area() {
        return this.width * this.height;
    }

    /** Gets the point at the center of this rect */
    center(out = <Point.Like> {}) {
        out.x = this.centerX;
        out.y = this.centerY;
        return out;
    }

    /** Measures the x-coordinate of the point at the center of this rect */
    get centerX() {
        return 0.5 * (this.left + this.right);
    }

    /** Measures the y-coordinate of the point at the center of this rect */
    get centerY() {
        return 0.5 * (this.bottom + this.top);
    }

    /** Gets the point at the top left corner of this rect */
    topLeft(out = <Point.Like> {}) {
        out.x = this.left;
        out.y = this.top;
        return out;
    }

    /** Gets the point at the bottom left corner of this rect */
    bottomLeft(out = <Point.Like> {}) {
        out.x = this.left;
        out.y = this.bottom;
        return out;
    }

    /** Gets the point at the bottom right corner of this rect */
    bottomRight(out = <Point.Like> {}) {
        out.x = this.right;
        out.y = this.bottom;
        return out;
    }

    /** Gets the point at the top right corner of this rect */
    topRight(out = <Point.Like> {}) {
        out.x = this.right;
        out.y = this.top;
        return out;
    }

    /** Checks if this rect is empty. True if left >= right or bottom >= top. */
    isEmpty() {
        return this.left >= this.right || this.bottom >= this.top;
    }

    /** Checks if the boundaries of this Rect represent a valid rectangle. True if right >= left and top >= bottom. */
    isValid() {
        return this.right >= this.left && this.top >= this.bottom;
    }

    /** Expands this rect to include the other rect */
    union(r: RectLike) {
        this.left = Math.min(this.left, r.left);
        this.right = Math.max(this.right, r.right);
        this.bottom = Math.min(this.bottom, r.bottom);
        this.top = Math.max(this.top, r.top);
    }

    /** Expands this rect to enclose the specified point */
    unionPoint({x, y}: Point.Like) {
        this.left = Math.min(x, this.left);
        this.top = Math.max(y, this.top);
        this.right = Math.max(x, this.right);
        this.bottom = Math.min(y, this.bottom);
    }

    /** Checks if this rect intersects the other rect */
    intersects(r: RectLike) {
        return this.right >= r.left && r.right >= this.left && this.top >= r.bottom && r.top >= this.bottom;
    }

    /** Finds the intersection of this rect with the other rect */
    intersect(r: RectLike) {
        this.left = Math.max(this.left, r.left);
        this.right = Math.min(this.right, r.right);
        this.bottom = Math.max(this.bottom, r.bottom);
        this.top = Math.min(this.top, r.top);
    }

    /** Insets the boundaries of this rect by the specified vector. */
    inset({x, y}: Vec2.Like) {
        this.left += x;
        this.top -= y;
        this.right -= x;
        this.bottom += y;
    }

    /** Offsets the position of this rect by the specified vector */
    offset({x, y}: Vec2.Like) {
        this.offsetX(x);
        this.offsetY(y);
    }

    /** Offsets the position of this rect by the specified change in x (dx) */
    offsetX(dx: number) {
        this.left += dx;
        this.right += dx;
    }

    /** Offsets the position of this rect by the specified change in y (dy) */
    offsetY(dy: number) {
        this.top += dy;
        this.bottom += dy;
    }

    /** Checks if this rect contains the other rect */
    contains(r: RectLike) {
        return this.left <= r.left && r.right <= this.right &&
            this.bottom <= r.bottom && r.top <= this.top;
    }

    /** Checks if this rect contains the specified point */
    containsPoint({x, y}: Point.Like) {
        return this.containsX(x) && this.containsY(y);
    }

    /** Checks if this rect contains any point with the specified x coordinate  */
    containsX(x: number) {
        return this.left <= x && x <= this.right;
    }

    /** Checks if this rect contains any point with the specified y coordinate  */
    containsY(y: number) {
        return this.bottom <= y && y <= this.top;
    }

    /** Swaps the top/bottom or left/right boundaries of this rect if they are flipped, meaning left > right and/or top > bottom */
    sort() {
        let {top, left, bottom, right} = this;
        let vFlipped = bottom > top;
        let hFlipped = left > right;
        this.top = vFlipped ? bottom : top;
        this.left = hFlipped ? right : left;
        this.bottom = vFlipped ? top : bottom;
        this.right = hFlipped ? left : right;
    }

    /** Checks if this rect is approximately equal to the other rect */
    equals(r: RectLike, e = 0) {
        return Math.abs(this.left - r.left) <= e
            && Math.abs(this.top - r.top) <= e
            && Math.abs(this.right - r.right) <= e
            && Math.abs(this.bottom - r.bottom) <= e;
    }
}
