import { Drawable, Mat2d, Point, Rect, Vec2, Renderer } from "..";

/** A graphic that can be transformed by altering its 2d model matrix. */
export abstract class Model {

    constructor(
        /** 2d matrix that maps this graphic from model space to world space. */
        public readonly matrix: Mat2d.Like
    ) {}

    /** 
     * Measures the position of this graphic's center point in world space. 
     * Assumes the model for the graphic is centered at the origin.
     **/
    get center(): Point.Like {
        return { x: this.matrix.c3r1, y: this.matrix.c3r2 };
    }

    /**
     * Centers this graphic at the specified point in world space.
     * Assumes the model for the graphic is centered at the origin.
     */
    set center({x, y}: Point.Like) {
        this.matrix.c3r1 = x;
        this.matrix.c3r2 = y;
    }

    /** Measures the boundaries of this graphic in world space. */
    abstract get bounds(): Rect.Like;

    /** Converts a point in this graphic's model space to a point in world space. */
    mapPointToWorldSpace(modelPoint: Point.Like, out = <Point.Like> {}) {
        return Mat2d.mapPoint(this.matrix, modelPoint, out);
    }

    /** Converts a point in world space to a point in this graphic's model space. */
    mapPointToModelSpace(worldPoint: Point.Like, out = <Point.Like> {}){
        return Mat2d.mapPoint(Mat2d.invert(this.matrix), worldPoint, out);
    }

    /** Checks if this graphic contains the specified point. */
    abstract containsPoint(p: Point.Like): boolean;
   
    /** Transforms this graphic by the specified matrix. */
    transform(m: Mat2d.Like) {
        Mat2d.concat(m, this.matrix, this.matrix);
    }

    /** Translates this graphic by the specified vector. */
    translate(v: Vec2.Like) {
        this.transform(Mat2d.translate(v));
    }

    /** Scales this graphic by the specified vector, with a pivot point at its center.  */
    scale(v: Vec2.Like){
        this.transform(Mat2d.pivot(Mat2d.scale(v), this.center));
    }

    /** Stretches this graphic by the specified factor, with a pivot point at its center. */
    stretch(factor: number){
        this.transform(Mat2d.pivot(Mat2d.stretch(factor), this.center))
    }

    /** Rotates this graphic by the specified angle, with a pivot point at its center. */
    rotate(radians: number){
        this.transform(Mat2d.pivot(Mat2d.rotate(radians), this.center));
    }
}