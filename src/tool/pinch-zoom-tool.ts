import { LineSegment, Point, Pointer, PointerEventListener, Vec2 } from "..";

export class PinchZoomTool extends PointerEventListener {

    private previousSpan: number;
    private previousFocus: Point.Like;

    wherePointer(p: Pointer) {
        return p.isDown && p.activePointers.length == 2;
    }

    onPointerDown(p: Pointer) {
        let line = this.measureLine(p);
        this.previousSpan = line.length;
        this.previousFocus = line.midpoint;
    }

    onPointerMove(p: Pointer) {
        let line = this.measureLine(p);
        let scale = line.length / this.previousSpan;
        let focus = Point.midpoint(line.midpoint, this.previousFocus);
        let actual = p.surface.zoomToPoint(scale, focus);
        this.previousSpan = line.length / actual.scale;
        this.previousFocus = Vec2.add(actual.offset, this.previousFocus);
    }

    private measureLine({activePointers}: Pointer) {
        let p1 = activePointers[0].position;
        let p2 = activePointers[1].position;
        return new LineSegment(p1, p2);
    }
}
  