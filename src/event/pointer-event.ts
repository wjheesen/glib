import { Surface, Point } from '..';

export const enum PointerStatus {
    Down, Move, Up, Cancel,
}

export class Pointer {
    constructor(
        public readonly id: number,
        public readonly index: number,
        public readonly status: PointerStatus,
        public readonly surface: Surface,
        public readonly position: Point.Like,
        public readonly isPrimary: boolean,
        public readonly activePointers: Pointer[],
    ) {}
}

export class PointerEventListener {
    wherePointer(p: Pointer) { return true; }
    onPointerDown(p: Pointer) {}
    onPointerMove(p: Pointer) {}
    onPointerUp(p: Pointer) {}
    onPointerCancel(p: Pointer) {}
}

export class PointerEventDetector {

    public readonly activePointers = <Pointer[]> {};
    private listeners = <PointerEventListener[]> [];

    constructor(
        private surface: Surface
    ) {}

    startListening() {
        let { canvasEl } = this.surface;
        canvasEl.addEventListener('pointerdown', this.onPointerDown);
        canvasEl.addEventListener('pointermove', this.onPointerMove);
        canvasEl.addEventListener('pointerup', this.onPointerUp);
        canvasEl.addEventListener('pointercancel', this.onPointerCancel);
    }

    stopListening() {
        let { canvasEl } = this.surface;
        canvasEl.removeEventListener('pointerdown', this.onPointerDown);
        canvasEl.removeEventListener('pointermove', this.onPointerMove);
        canvasEl.removeEventListener('pointerup', this.onPointerUp);
        canvasEl.removeEventListener('pointercancel', this.onPointerCancel);
    }

    addListener(listener: PointerEventListener) {
        this.listeners.push(listener);
    }

    private onPointerDown = (e: PointerEvent) => {
        let pointer = this.addPointer(e, PointerStatus.Down);
        this.dispatchEvent(pointer, l => l.onPointerDown(pointer));
    }

    private onPointerMove = (e: PointerEvent) => {
        let pointer = this.addPointer(e, PointerStatus.Move);
        this.dispatchEvent(pointer, l => l.onPointerMove(pointer));
    }
  
    private onPointerUp = (e: PointerEvent) => {
        let pointer = this.addPointer(e, PointerStatus.Up);
        this.dispatchEvent(pointer, l => l.onPointerUp(pointer));
        this.removePointer(pointer);
    }

    private onPointerCancel = (e: PointerEvent) => {
        let pointer = this.addPointer(e, PointerStatus.Up);
        this.dispatchEvent(pointer, l => l.onPointerCancel(pointer));
        this.removePointer(pointer);
    }

    private dispatchEvent(p: Pointer, invokeFn: (listener: PointerEventListener) => any) {
        this.listeners.filter(l => l.wherePointer(p)).forEach(invokeFn);
    }

    private addPointer(e: PointerEvent, status: PointerStatus) {
        let pointer = this.newPointer(e, status);
        this.activePointers.push(pointer);
        return pointer;
    }

    private newPointer(e: PointerEvent, status: PointerStatus) {
        return new Pointer(
            e.pointerId, this.activePointers.length, 
            status, this.surface, this.surface.mapScreenPointToWorld(e),
            e.isPrimary, this.activePointers
        );
    }

    private removePointer(p: Pointer) {
        delete this.activePointers[p.index];
    }
}