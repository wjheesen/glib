import { Camera, Program } from '..';

/** Helper class for rendering graphics with WebGL. */
export class Renderer {

    public readonly angleExt = this.gl.getExtension('ANGLE_instanced_arrays');

    /** The location of the currently bound program. */
    private currentProgram: Program;

    constructor(
        public readonly gl: WebGLRenderingContext, 
        public readonly camera: Camera,
    ) {}

    /**
     * Called whenever the canvas size changes.
     * @param width the new width of the canvas.
     * @param height the new height of the canvas.
     */
    onSurfaceChange(width: number, height: number) {
        // Update the viewport to match the new dimensions of the drawing buffer
        this.gl.viewport(0, 0, width, height);
        // Adjust camera to viewport
        this.camera.setViewport(width, height);
    }

    /** Binds the specified program to the WebGL rendering context, if not already bound. */
    useProgram(program: Program) {
        if (this.currentProgram !== program) {
            this.attachProgram(program);
        }
    }

    private attachProgram(program: Program) {
        this.gl.useProgram(program.location);
        // Notify detached program
        if(this.currentProgram){ this.currentProgram.onDetach(this); }
        // Notify attached program
        program.onAttach(this);
        // Keep track of the current program
        this.currentProgram = program;
    }
};