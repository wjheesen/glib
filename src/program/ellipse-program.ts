import { ColorfBuffer, Mat2dBuffer, Program, ProgramUtil, PolygonMesh, Rect, Renderer } from '..';
import * as Shader from './ellipse-shader'

/** Program for rendering ellipses. */
export class EllipseProgram extends Program<Shader.Uniforms, Shader.Attributes> {

    static readonly mesh = PolygonMesh.rectangle(Rect.dimensions(-1, 1, 2, 2));

    private positionBuffer: WebGLBuffer;
    private matrixBuffer: WebGLBuffer;

    public fillColor: ColorfBuffer;
    public strokeColor: ColorfBuffer;
    public lineWidth: number;
    
    static create(util: ProgramUtil) {
        let program = new EllipseProgram;
        program.location = util.createProgramFromSources(Shader.vertex, Shader.fragment);
        program.uniforms = util.getUniformLocationMap(program.location, Shader.uniformRenaming) as Shader.Uniforms;
        program.attribs = util.getAttributeLocationMap(program.location, Shader.attributeRenaming) as Shader.Attributes;
        program.positionBuffer = util.createArrayBuffer(EllipseProgram.mesh.vertices.data);
        program.matrixBuffer = util.createBuffer();
        return program;
    }

    onAttach({gl, angleExt}: Renderer) {
        let c1 = this.attribs.model;
        let c2 = c1 + 1;
        let c3 = this.attribs.offset;

        // Enable blending (for transparency)
        gl.enable(gl.BLEND);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.attribs.position);
        gl.vertexAttribPointer(this.attribs.position, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.matrixBuffer);

        gl.enableVertexAttribArray(c1);
        gl.enableVertexAttribArray(c2);
        gl.enableVertexAttribArray(c3);
        
        angleExt.vertexAttribDivisorANGLE(c1, 1);
        angleExt.vertexAttribDivisorANGLE(c2, 1);
        angleExt.vertexAttribDivisorANGLE(c3, 1);
    }

    onDetach({angleExt}: Renderer) {
        let c1 = this.attribs.model;
        let c2 = c1 + 1;
        let c3 = this.attribs.offset;

        angleExt.vertexAttribDivisorANGLE(c1, 0);
        angleExt.vertexAttribDivisorANGLE(c2, 0);
        angleExt.vertexAttribDivisorANGLE(c3, 0);       
    }

    draw(renderer: Renderer, matrices: Mat2dBuffer) {
        let {gl, angleExt, camera } = renderer;
        renderer.useProgram(this);
        this.loadProjection(gl, camera.matrix);
        this.loadMatrices(gl, matrices);
        this.loadFillColor(gl);
        this.loadStrokeColor(gl);
        this.loadLineWidth(gl);
        angleExt.drawArraysInstancedANGLE(gl.TRIANGLE_FAN, 0, 4, matrices.length);
    }

    private loadProjection(gl: WebGLRenderingContext, projection: Float32Array) {
        gl.uniformMatrix4fv(this.uniforms.projection, false, projection);
    }

    /** Sets the matrix for each ellipse instance.*/
    private loadMatrices(gl: WebGLRenderingContext, matrices: Mat2dBuffer) {
        // Note: assumes 
        // (1) matrix buffer is already bound
        // (2) attrib arrays are already enabled
        // (3) attrib divisors have already been specified
        let c1 = this.attribs.model;
        let c2 = c1 + 1;
        let c3 = this.attribs.offset;
        
        // Load data into WebGL
        gl.bufferData(gl.ARRAY_BUFFER, matrices.data, gl.DYNAMIC_DRAW);

        // Set first column vector (part of mat2)
        gl.vertexAttribPointer(c1, 2, gl.FLOAT, false, 24, 0);
        
        // Set second column vector (part of mat2)
        gl.vertexAttribPointer(c2, 2, gl.FLOAT, false, 24, 8);

        // Set third column vector (separate vec2)
        gl.vertexAttribPointer(c3, 2, gl.FLOAT, false, 24, 16);
    }

    /** Loads the fill color for the ellipse batch into this program. */
    private loadFillColor(gl: WebGLRenderingContext) {
        gl.uniform4fv(this.uniforms.fillColor, this.fillColor.data);
    }

    /** Loads the stroke color for the ellipse batch into this program. */
    private loadStrokeColor(gl: WebGLRenderingContext) {
        gl.uniform4fv(this.uniforms.strokeColor, this.strokeColor.data);
    }

    /** Loads the width of the lines making up the stroke. */
    private loadLineWidth(gl: WebGLRenderingContext) {
        gl.uniform1f(this.uniforms.lineWidth, this.lineWidth);
    }
}