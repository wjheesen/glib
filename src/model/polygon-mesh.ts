import { Point, Mat2d, Vec2, Vec2Buffer, Mesh, Rect } from '..';

export class PolygonMesh extends Mesh {

    static regularPolygon(n: number, flatTop = false) {
        return new PolygonMesh(this.regularVertices(n, flatTop), this.regularIndices(n));
    }

    /**
     * Generates the vertices for a regular polygon centered at (0,0).
     * @param n how many sides the polygon should have.
     * @param isFlatTopped whether the polygon is flat-topped (true) or pointy-topped (false). Defaults to false.
     */
    static regularVertices(n: number, flatTop = false) {
        // Create a buffer large enough to hold the n vertices
        let vertices = Vec2Buffer.withLength(n);
        // Create a matrix to rotate from vertex to vertex
        let angle = 2 * Math.PI / n;
        let rotation = Mat2d.rotate(angle)
        // Begin with the vertex (0,1), rotating for flat top polygon if requested
        let v = vertices.get(0); v.y = 1;
        if (flatTop) {
            Mat2d.mapPoint(Mat2d.rotate(angle / 2), v, v);
        }
        // Keep rotating the point and adding to buffer till it is full
        for (let i = 1; i < n; i++) {
            Mat2d.mapPoint(rotation, vertices.get(i - 1), vertices.at(i));
        }
        return vertices;
    }

    /**
     * Generates the indices for a regular polygon with n sides.
     * The resulting index array will have have 3*(n-2) indices.
     * @param n how many sides the mesh should have.
     */
    static regularIndices(n: number) {
        let indices = new Uint16Array(3 * (n - 2));
        for (let i = 0; i < n; i++) {
            indices[3 * i + 1] = i + 1;
            indices[3 * i + 2] = i + 2;
        }
        return indices;
    }

    /**
     * Creates the mesh for a rectangle
     * @param id an optional id for the mesh.
     */
    static rectangle(r: Rect) {
        let vertices = PolygonMesh.rectangleVertices(r);
        let indices = PolygonMesh.regularIndices(4);
        return new PolygonMesh(vertices, indices);
    }

    /**
      * Extracts the vertices from the specified rect into a new vertex buffer.
      * @param rect the rect from which to extract the vertices.
      */
    static rectangleVertices(r: Rect) {
        let vertices = Vec2Buffer.withLength(4);
        r.topLeft(vertices.at(0));
        r.bottomLeft(vertices.at(1));
        r.bottomRight(vertices.at(2));
        r.topRight(vertices.at(3));
        return vertices;
    }

    /**
     * Creates the mesh for a star with n points and the specified inner and outer radii.
     * @param n how many points the star should have.
     * @param ratio ratio of the inner radius to the outer radius.
     */
    static star(n: number, ratio: number) {
        let vertices = PolygonMesh.starVertices(n, ratio);
        let indices = PolygonMesh.starIndices(n);
        return new PolygonMesh(vertices, indices);
    }

    /**
     * Generates the vertices for a star centered at (0,0).
     * @param points how many points the star should have.
     * @param ratio ratio of the inner radius to the outer radius.
     */
    static starVertices(points: number, ratio: number) {
        // Create vertex buffer big enough to hold the n inner vertices and n outer vertices
        let vertices = Vec2Buffer.withLength(points + points);
        // Calculate the rotation angle
        let angle = 2 * Math.PI / points;
        let rotation = Mat2d.rotate(angle);
        // Start with (0, 1) as the outer vertex
        vertices.y = 1;
        // Scale by the specified ratio and rotate by half the angle to get the first inner vertex
        Mat2d.mapPoint(Mat2d.rotate(0.5 * angle), { x: 0, y: ratio }, vertices.at(1));
        // Keep rotating the inner and outer vertices and adding them to the buffer until it is full.
        for (let i = 2; i < vertices.length; i++) {
            Mat2d.mapPoint(rotation, vertices.get(i - 2), vertices.at(i));
        }
        return vertices;
    }

    /**
     * Generates the indices for a star with n points.
     * The star will have 3*(n-2) inner indices and 3n outer indices.
     * @param n how many points the star should have.
     */
    static starIndices(n: number) {
        // Create an array big enough to hold all the indices
        let innerIndexCount = 3 * (n - 2);
        let outerIndexCount = 3 * n;
        let indices = new Uint16Array(innerIndexCount + outerIndexCount);
        // Compute inner indices and add to array
        let first = 1, second = 3, third = 5;
        for (let i = 0; i < innerIndexCount; second += 2, third += 2) {
            indices[i++] = first;
            indices[i++] = second;
            indices[i++] = third;
        }
        // Computer outer indices and add to array
        first = 2 * n - 1; second = 0; third = 1;
        for (let i = 0; i < outerIndexCount; i++, first = third++, second = third++) {
            indices[i++] = first;
            indices[i++] = second;
            indices[i++] = third;
        }
        // Return the indices
        return indices;
    }

    static miters(vertices: Vec2Buffer){
        let length = vertices.length, lastIndex = length - 1;
        let miters = Vec2Buffer.withLength(length);
        let prev = Vec2.copy(vertices.at(lastIndex));
        let curr = Vec2.copy(vertices.at(0));
        let line1 = Vec2.fromPointToPoint(prev, curr);
        let line2 = <Vec2.Like> {};
        for (let i = 0; i < length; i++) {
            Vec2.copy(curr, prev);
            Vec2.copy(vertices.at((i + 1) % lastIndex), curr);
            Vec2.fromPointToPoint(prev, curr, line2);
            Vec2.miter(line1, line2, 1, 3, miters.at(i));
            Vec2.copy(line2, line1);
        }
        return miters;
    }

    public readonly miters = PolygonMesh.miters(this.vertices);

    containsPoint(p: Point.Like): boolean {
        return this.vertices.containsPoint(p);
    }
}

