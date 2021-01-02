import { Mat2d, Rect, Renderer, PolygonModel, Point, Vec2 } from '..';
import { EllipseProgram } from '../program/ellipse-program';

export class EllipseModel extends PolygonModel {

    /**
     * Measures the boundaries of a unit circle transformed to an ellipse by the specified matrix.
     * @param matrix the transformation matrix.
     */
    static measureBoundaries(matrix: Mat2d.Like): Rect.Like {
        // Performs singular value decomposition of the model matrix to extract
        // (1) The length of the semi-x axis (sx), which is equal to the first singular value in the Sigma matrix
        // (2) The length of the semi-y axis (sy), which is equal to the second singular value in the Sigma matrix
        // (3) The rotation angle (phi), from -PI/2 to PI/2, which is equal to the angle used to form the U matrix
        // Boundaries are then meausure with the formula:
        // x = (sx)^2 * (cos(phi)^2) + (sy)^2*(sin(phi)^2)
        // y = (sx)^2 * (sin(phi)^2) + (sy)^2*(cos(phi)^2)
        // left = tx - x, right = tx + x, bottom = ty - y, top = ty + y
        let { c1r1: a, c2r1: b, c3r1: tx, c1r2: c, c2r2: d, c3r2: ty } = matrix;

        // Helper variables:
        let a2 = a*a;
        let b2 = b*b;
        let c2 = c*c;
        let d2 = d*d;
        let m = a*c + b*d;
        let n = a2 + b2 - c2 - d2;

        // Cos and sin of angle squared:
        let phi = 0.5 * Math.atan2(2*m, n);
        let cos2 = Math.pow(Math.cos(phi), 2);
        let sin2 = Math.pow(Math.sin(phi), 2);

        // Length of axes squared:
        let s1 = a2 + b2 + c2 + d2;
        let s2 = Math.sqrt(n*n + 4*m*m);
        let sx2 = 0.5 * (s1 + s2);
        let sy2 = 0.5 * (s1 - s2);

        // Boundaries:
        let x = Math.sqrt(sx2*cos2 + sy2*sin2);
        let y = Math.sqrt(sx2*sin2 + sy2*cos2);
        return { left: tx - x, right: tx + x, top: ty + y, bottom: ty - y };
    }

    constructor(matrix?: Mat2d.Like) {
        super(EllipseProgram.mesh, matrix);
    }

    get bounds(): Rect.Like {
        return EllipseModel.measureBoundaries(this.matrix);
    }

    set bounds(dst: Rect.Like) { // Preserves orientation
        this.transform(Mat2d.rectToRect(this.bounds, dst));
    }

    /** Checks if this ellipse contains the specified point. */
    contains(p: Point.Like) {
        let modelPoint = this.mapPointToModelSpace(p);
        if(Rect.containsPoint(this.mesh.bounds, modelPoint)){
            return Vec2.length2(modelPoint) <= 1;
        } 
        return false;
    }
}
