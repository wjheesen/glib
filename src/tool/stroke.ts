
import { Vec2, Point } from '..';

export class Stroke {

    public readonly vertices = <Point.Like[]> [];

    /**
     * Begins this stroke at the specified point.
     * @param p where to begin the stroke.
     * @param thickness the thickness of the initial line.
     */
    moveTo({x, y}: Point.Like, thickness: number) {
        let halfThickness = thickness * 0.5;
        let top = {x: x, y: y + halfThickness};
        let bot = {x: x, y: y - halfThickness};
        this.vertices.push(top, bot);
    }

   /**
     * Adds a line to the specified point.
     * @param point the point at the end of the line.
     * @param thickness the thickness of the line.
     */
    lineTo(p: Point.Like, thickness: number) {
        let nextIndex = this.vertices.length;
        if (nextIndex < 2) {
            throw "Must make a call to moveTo() before making a call to lineTo()"
        }

        let halfThickness = 0.5 * thickness
        let prevCen = this.getPreviousPoint(nextIndex);
        let line = Vec2.fromPointToPoint(prevCen, p);
        let prevLine = null;
        
        // Merge with previous line if the length of either line is less than half of the desired thickness
        if (nextIndex >= 4) {
            let prevPrevCen = this.getPreviousPoint(nextIndex - 2);
            prevLine = Vec2.fromPointToPoint(prevPrevCen, prevCen);
            if(Vec2.length(line) <= halfThickness && Vec2.length(prevLine) <= halfThickness){
                nextIndex -= 2;
                prevCen = prevPrevCen;
                line = Vec2.fromPointToPoint(prevCen, p);
                prevLine = nextIndex >= 4 ? this.getPreviousPoint(nextIndex - 2) : null;
            }
        }

        // If there are more than two line segments (with non-zero length), use a miter vector to join them. 
        // Otherwise use the ortho vector to compute the top and bottom left vertices of the line segment.
        let ortho = Vec2.multiply(Vec2.normalize(Vec2.rotate90(line)), halfThickness);
        let useMiter = prevLine !== null && Vec2.length(prevLine) > thickness / 8; 
        let miter = useMiter ? Vec2.miter(prevLine, line, halfThickness, thickness) : ortho;

        // Join to previous line
        this.vertices[nextIndex - 2] = Vec2.add(prevCen, miter);
        this.vertices[nextIndex - 1] = Vec2.subtract(prevCen, miter);
        this.vertices[nextIndex + 0] = Vec2.add(p, ortho);
        this.vertices[nextIndex + 1] = Vec2.subtract(p, ortho);
    }

    private getPreviousPoint(currIndex: number) {
        let vertices = this.vertices;
        let prevTop = vertices[currIndex - 2];
        let prevBot = vertices[currIndex - 1];
        return Point.midpoint(prevTop, prevBot);
    }
}
