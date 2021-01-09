import { Point, Pointer, PointerEventListener, Vec2 } from "..";

export class PanTool extends PointerEventListener {

    private previous: Point.Like;

    wherePointer(p: Pointer) {
        return p.activePointers.length == 1;
    }

    onPointerDown(p: Pointer) {
        this.previous = p.position;
    }

    onPointerMove({position, surface}: Pointer) {
        let toPrevious = Vec2.fromPointToPoint(this.previous, position);
        let actual = surface.pan(toPrevious);
        Vec2.add(actual, this.previous, this.previous);
    }
}
   