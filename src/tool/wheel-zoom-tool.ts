import {Wheel, WheelEventListener} from '..'

/** Tool for zooming in and out of a surface based on scroll events and cursor position. */
export class WheelZoomTool implements WheelEventListener {

    constructor(
        /** The scale applied to the surface when zooming in. The inverse is applied when zooming out. */
        public scaleFactor: number
    ){}

    onWheel(wheel: Wheel) {
        let scale = wheel.deltaY < 0 ? this.scaleFactor : 1 / this.scaleFactor;
        let actual = wheel.surface.zoomToPoint(scale, wheel.position);
    }
}