import { Surface, Point } from '..';

export const enum PointerStatus {
    Down, Move, Up, Cancel,
}

export class Pointer {
    constructor(
        public readonly id: number,
        public readonly status: PointerStatus,
        public readonly surface: Surface,
        public readonly position: Point.Like,
        public readonly isPrimary: boolean,
        public readonly isDown: boolean,
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

    public readonly activePointers = <Pointer[]> [];
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
        let index = this.getPointerIndex(e.pointerId);
        let isDown = status == PointerStatus.Down || !!this.activePointers[index]?.isDown;
        let pointer = this.newPointer(e, status, isDown);
        this.surface.canvasEl.setPointerCapture(pointer.id);
        this.activePointers[index] = pointer;
        return pointer;
    }

    private newPointer(e: PointerEvent, status: PointerStatus, isDown: boolean) {
        return new Pointer(
            e.pointerId, status, this.surface, 
            this.surface.mapScreenPointToWorld(e),
            e.isPrimary, isDown, this.activePointers
        );
    }

    private getPointerIndex(pointerId: number): number {
        for (let i = 0; i < this.activePointers.length; i++) {
            if (this.activePointers[i].id == pointerId) {
                return i;
            }
        }
        return this.activePointers.length;
    }

    private removePointer(pointer: Pointer) {
        this.surface.canvasEl.releasePointerCapture(pointer.id);
        this.activePointers.splice(this.getPointerIndex(pointer.id), 1);
    }
}