import { Point, Pointer, PointerEventListener, Vec2 } from "..";

export class PanTool extends PointerEventListener {

    private previous?: Point.Like;

    wherePointer(p: Pointer) {
        return p.isDown;
    }

    onPointerDown(p: Pointer) {
        if (p.activePointers.length == 1) {
            this.previous = p.position;
        }
    }

    onPointerMove(p: Pointer) {
        if (p.activePointers.length > 1) {
            this.previous = null; // Invalidate
        } else if (!this.previous) {
            this.previous = p.position; // Reset
        } else {
            this.pan(p);
        }
    }

    private pan({position, surface}: Pointer) {
        let toPrevious = Vec2.fromPointToPoint(position, this.previous); 
        let actual = surface.pan(toPrevious);
        Vec2.add(actual, position, this.previous);
    }
}
   