import { Drawable, Point, Renderer, Rect, Vec2, ScreenPoint } from '..';

/** A rendering surface linked to an HTMLCanvasElement (the drawing buffer). */
export class Surface {

    /** The drawing buffer's bounding client rect. */
    clientRect = this.canvasEl.getBoundingClientRect();

    /*** True if a request has been made to re-render this surface. */
    hasRenderRequest = false;

    constructor(
        public readonly canvasEl: HTMLCanvasElement, 
        public readonly renderer: Renderer,
        public readonly scene: Drawable
    ) {}

    startRenderLoop() {
        this.requestRender();
        this.checkRender();
    }

    /** Checks each frame if the surface needs to be re-rendered. */
    private checkRender = () => {
        // Resize surface if necessary
        this.resize()
        // Notify surface of animation frame
        this.onAnimationFrame()
        // Keep calling this function every frame
        requestAnimationFrame(this.checkRender);
    }

    /**
     * Requests that this surface be re-rendered.
     */
    requestRender() {
        this.hasRenderRequest = true;
    }

    /**
     * Re-renders this surface if it has a render request.
     */
    onAnimationFrame(){
        if(this.hasRenderRequest){
            this.scene.draw(this.renderer);
            this.hasRenderRequest = false;
        }
    }

    /** Resizes this surface to match the specified width/height dimensions. */
    resize(width = this.canvasEl.clientWidth, height = this.canvasEl.clientHeight) {
        // If width or height has changed
        if (this.canvasEl.width !== width || this.canvasEl.height !== height) {
            // Resize canvas to specified dimensions
            this.canvasEl.width = width;
            this.canvasEl.height = height;
            // Get new bounding box
            this.clientRect = this.canvasEl.getBoundingClientRect();
            // Notify renderer of surface change
            this.renderer.onSurfaceChange(width, height);
            // Request render to show changes
            this.requestRender();
        }
    }

    /** Sends a request to pan the image displayed by this surface. */
    pan(desiredOffset: Vec2.Like) {
        let camera = this.renderer.camera;
        let actual = camera.offset(desiredOffset);
        if (Vec2.length2(actual) != 0) {
            this.requestRender();
        }
        return actual;
    }

    /** Sends a request to zoom into the image displayed by this surface. */
    zoomIn(desiredScaleFactor: number){
        let camera = this.renderer.camera;
        let actual = camera.zoomIn(desiredScaleFactor);
        if(actual != 1){
            this.requestRender();
        }
    }

    /** Sends a request to zoom out of the image displayed by this surface. */
    zoomOut(desiredScaleFactor: number){
        this.zoomIn(1/desiredScaleFactor);
    }

    /** Sends a request to zoom into the image displayed by this surface while fixing the specified focus point. */
    zoomToPoint(desiredScaleFactor: number, focus: Point.Like) {
        let camera = this.renderer.camera;
        let actual = camera.zoomToPoint(desiredScaleFactor, focus);
        if(actual.scale != 1 || Vec2.length2(actual.offset) != 0){
            this.requestRender();
        }
        return actual;
    }

    /** Maps a screen point to canvas space. */
    mapScreenPointToCanvas(screenPoint: ScreenPoint): Point.Like {
        return {
            x: screenPoint.clientX - this.clientRect.left,
            y: screenPoint.clientY - this.clientRect.top
        };
    }

    /** Maps a screen point to NDC space [0,1].*/
    mapScreenPointToNdc(screenPoint: ScreenPoint) {
        return this.mapCanvasPointToNdc(this.mapScreenPointToCanvas(screenPoint));
    }

    /** Maps a screen point to clip space. */
    mapScreenPointToWorld(screenPoint: ScreenPoint) {
        return this.mapNdcToWorld(this.mapScreenPointToNdc(screenPoint));
    }

    /** Maps a canvas coordinate to NDC space [0,1]. */
    mapCanvasPointToNdc(canvasPoint: Point.Like) {
        let {width, height} = this.clientRect;
        let x = canvasPoint.x / width;
        let y = (height - canvasPoint.y) / height; // Flip in y axis
        return {x: x, y: y};
    }

    /** Maps a normalized device coordinate (NDC) to world space. */
    mapNdcToWorld(ndc: Point.Like) {
        let view = this.renderer.camera.view; // Depends on what is currently in view
        let x = view.left + (ndc.x * view.width);
        let y = view.bottom + (ndc.y * view.height);
        return {x: x, y: y};
    }
};
