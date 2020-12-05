import { Graphic, Mesh, Mat2d, Rect, Point, LineSegment, Vec2 } from "..";

/** Shape defined by matrix transformation of a mesh. */
export class Shape extends Graphic {

    /**
     * Creates a shape with the specified mesh data and initial transformation matrix.
     * @param mesh the static vertex and index data data for this shape.
     * @param matrix the initial transformation matrix. Defaults to identiy.
     */
    constructor(
        public readonly mesh: Mesh, matrix = Mat2d.identity()){
        super(matrix);
    }

    get bounds(): Rect.Like {
        let { vertices } = this.mesh;
        let { x, y } = this.convertPointToWorldSpace(vertices.at(0));
        let bounds = Rect.dimensions(x, y, 0, 0);
        for (let i = 1; i < vertices.length; i++) {
            Rect.unionPoint(bounds, this.convertPointToWorldSpace(vertices.at(i)), bounds);
        }
        return bounds;
    }

    set bounds(bounds: Rect.Like) {
        this.scaleToFit(bounds);
    }

    /** Get the position of the vertex at the specified index */
    vertexAt(index: number, out = <Vec2.Like> {}) {
        return this.convertPointToWorldSpace(this.mesh.vertices.at(index), out);
    }

    containsPoint(p: Point.Like): boolean {
        return this.mesh.containsPoint(this.convertPointToModelSpace(p));
    }

    /** Scales this shape to fit inside the destination rect using the specified scale to fit option */
    scaleToFit(dst: Rect.Like, stf = Mat2d.ScaleToFit.Fill) {
        Mat2d.rectToRect(this.mesh.bounds, dst, stf, this.matrix);
    }

    /** Stretch-rotates this shape across the specified line segment */
    stretchAcross({p1, p2}: LineSegment.Like) {
        // Translate center top to p1
        let b = this.mesh.bounds;
        let cx = Rect.centerX(b);
        let v = Vec2.fromPointToPoint({ x: cx, y: b.top }, p1);
        let t = Mat2d.translate(v, this.matrix);
        
        // Stretch rotate from (translated) center bottom to p2, with pivot point at p1
        let c = Mat2d.mapPoint(t, {x: cx, y: b.bottom});
        let s = Mat2d.stretchRotateToPoint(c, p2, p1);
        this.transform(s);
    }
}