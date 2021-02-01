import { Surface, Point } from '..';

export const enum WheelStatus {
    Down, Move, Up, Cancel,
}

export class Wheel {
    constructor(
        public readonly deltaY,
        public readonly surface: Surface,
        public readonly position: Point.Like,
    ) {}
}

export interface WheelEventListener {
    onWheel(w: Wheel);
}

export class WheelEventDetector {

    private listeners = <WheelEventListener[]> [];

    constructor(
        private surface: Surface
    ) {}

    startListening() {
        this.surface.canvasEl.addEventListener('wheel', this.onWheel);
    }

    stopListening() {
        this.surface.canvasEl.removeEventListener('wheel', this.onWheel);
    }

    addListener(listener: WheelEventListener) {
        this.listeners.push(listener);
    }

    private onWheel = (e: WheelEvent) => {
        e.preventDefault(); // TODO: maybe only prevent default if the onWheel function returns true?
        let wheel = new Wheel(e.deltaY, this.surface, this.surface.mapScreenPointToWorld(e));
        this.listeners.forEach(l => l.onWheel(wheel));
    }
}