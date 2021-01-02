import { Rect, Vec2, Mat4, Mat2d, Point } from '..';

/** Defines an orthographic projection from world space to clip space. */
export class Camera {

    /** The orthographic projection matrix that puts the world in view. */
    public readonly matrix = new Float32Array(16);

    /** The area of the world that is currently in view. */
    public readonly view = Rect.copy(this.world);

    /** The current position of the camera in relation to the center of the world. */
    public readonly position = Rect.center(this.world);

    /** The current zoom setting for this camera. */
    public zoom = 1;

    constructor(
        /** The area that can be viewed by this camera */
        public readonly world: Rect.Like,
        /** The min-allowed zoom setting for this camera. */
        public readonly minZoom: number,
        /** The max-allowed zoom setting for this camera. */
        public readonly maxZoom: number
    ) {}

    /**
     * Sets the size of the viewport in which the camera image will be displayed.
     * The resulting image will be centered inside the viewport and will match the aspect of the camera. 
     * @param vw the new width of the viewport.
     * @param vh the new height of the viewport.
     */
    setViewport(vw: number, vh: number) {
        // Compute width to height ratio of viewport and world
        let vr = vw / vh, wr = Rect.aspect(this.world);
        // Scale width or height of view to match aspect of viewport
        let m = Mat2d.scale(wr < vr ? {x: vr / wr, y: 1} : {x: 1, y: wr / vr});
        // Apply our other camera settings on top
        Mat2d.concat(Mat2d.stretch(1 / this.zoom), m, m);
        Mat2d.concat(Mat2d.translate(this.position), m, m);
        Mat2d.mapRect(m, this.world, this.view);
        // Update matrix to reflect changes to view
        this.updateMatrix();
    }

    /**
     * Sends a request to offset this camera by the desired vector.
     * Note: the desired offset may be adjusted to keep the camera from viewing anything outside of the world area.
     * @param desiredOffset the desired offset. 
     * @returns the actual offset.
     */
    offset(desiredOffset: Vec2.Like) {
        let target = Vec2.add(desiredOffset, this.position);
        let ratio = (this.zoom - this.minZoom) / this.zoom;
        let size = Mat2d.mapRect(Mat2d.stretch(ratio), this.world); // Max allowable size given zoom
        let far = Rect.offset(size, Vec2.rotate180(Rect.center(size))); // Center at origin so we know how far we can go in any direction

        let actualOffset = Vec2.copy(desiredOffset);
        // If world position is too far left
        if (target.x < far.left) {
            // Adjust offset so that offset.x + position.x = far.left
            actualOffset.x = far.left - this.position.x;
        }
        // If world position is too far right
        else if (target.x > far.right) {
            // Adjust offset so that offset.x + position.x = far.right
            actualOffset.x = far.right - this.position.x;
        }
        // If world position is too far down
        if (target.y < far.bottom) {
            // Adjust offset so that offset.y + position.y = far.bottom
            actualOffset.y = far.bottom - this.position.y;
        }
        // If world position is too far up
        else if (target.y > far.top) {
            // Adjust offset so that offset.y + position.y = far.top
            actualOffset.y = far.top - this.position.y;
        }

        // Now we can safely apply the offset
        Rect.offset(this.view, actualOffset, this.view);
        Vec2.add(this.position, actualOffset, this.position);
        this.updateMatrix();
        return actualOffset;
    }

    /**
     * Sends a request to zoom in this camera by the desired scale factor.
     * Note: the desired scale factor is automatically adjusted to keep the camera from viewing anything outside of the world area. 
     * @param desiredScaleFactor the desired scale factor.
     * @returns the actual scale factor.
     */
    zoomIn(desiredScaleFactor: number) {
        let targetZoom = this.zoom * desiredScaleFactor;
        let actualScaleFactor: number;
        if (targetZoom < this.minZoom) {
            // Adjust scale factor so that zoom * changeInZoom = minZoom
            actualScaleFactor = this.minZoom / this.zoom;
            this.zoom = this.minZoom;
        } else if (targetZoom > this.maxZoom) {
            // Adjust scale factor so that zoom * changeInZoom = maxZoom
            actualScaleFactor = this.maxZoom / this.zoom;
            this.zoom = this.maxZoom;
        } else {
            // No need to adjust scale factor
            actualScaleFactor = desiredScaleFactor;
            this.zoom = targetZoom;
        }
        let m = Mat2d.pivot(Mat2d.stretch(1 / actualScaleFactor), this.position);
        Mat2d.mapRect(m, this.view, this.view);
        this.updateMatrix();
        return actualScaleFactor;
    }

    /**
     * Sends a request to zoom this camera by the desired scale factor.
     * Note: the desired scale factor is automatically adjusted to keep the camera from viewing anything outside of the world area. 
     * @param desired the desired scale factor.
     * @param focus the focus point. 
     * @returns the actual scale factor and offset.
     */
    zoomToPoint(desiredScaleFactor: number, focus: Point.Like) {
        let view = this.view
        // Convert (x,y) coordinates to [0,1] space
        let normX = (focus.x - view.left) / Rect.width(view);
        let normY = (focus.y - view.bottom) / Rect.height(view);
        // Apply scale factor
        let actualScaleFactor = this.zoomIn(desiredScaleFactor);
        // Determine position of focus point after change in zoom
        let aft: Vec2.Like = {
            x: view.left + (normX * Rect.width(view)),
            y: view.bottom + (normY * Rect.height(view))
        }
        // Compute offset back to focus point
        let offset = Vec2.fromPointToPoint(aft, focus);
        // Apply the offset
        let actualOffset = this.offset(offset);
        // Return actual scale factor and offset so caller can check if they differ from desired
        return {scale: actualScaleFactor, offset: actualOffset};
    }

    /** Recalculates the projection matrix to reflect changes in the camera settings.*/
    private updateMatrix() {
        Mat4.ortho(this.view, 0.1, 10, this.matrix);
    }
}