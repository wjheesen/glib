import { Program, ColorfBuffer, Mesh, Renderer, ProgramUtil, Mat2dBuffer, Vec2Buffer } from "..";
import * as Shader from '../shader/stroke'

export class StrokeProgram extends Program<Shader.Uniforms, Shader.Attributes> {

    public color: ColorfBuffer;
    public lineWidth: number;

    private indexBuffer: WebGLBuffer;
    private positionBuffer: WebGLBuffer;
    private matrixBuffer: WebGLBuffer;
    private miterBuffer: WebGLBuffer;

    static create(util: ProgramUtil, meshes: Mesh[]) {
        meshes = meshes.filter(mesh => mesh.miters);
        let program = new StrokeProgram();
        program.location = util.createProgramFromSources(Shader.vertex, Shader.fragment);
        program.uniforms = util.getUniformLocationMap(program.location, Shader.uniformRenaming) as Shader.Uniforms;
        program.attribs = util.getAttributeLocationMap(program.location, Shader.attributeRenaming) as Shader.Attributes;
        program.indexBuffer = util.createStrokeIndexBuffer(meshes);
        program.positionBuffer = util.createStrokeVertexBuffer(meshes);
        program.miterBuffer = util.createMiterBuffer(meshes);
        program.matrixBuffer = util.createBuffer();
        return program;
    }

    onAttach({ gl }: Renderer) {
        let column1 = this.attribs.model;
        let column2 = column1 + 1;
        let column3 = this.attribs.offset;

        gl.enable(gl.BLEND);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.enableVertexAttribArray(this.attribs.position);

        // Enable a separate array for each column of the 3x2 model matrix
        gl.enableVertexAttribArray(column1);
        gl.enableVertexAttribArray(column2); 
        gl.enableVertexAttribArray(column3);
        
        // Only change the model matrix when the instance changes
        gl.vertexAttribDivisor(column1, 1); 
        gl.vertexAttribDivisor(column2, 1);
        gl.vertexAttribDivisor(column3, 1);

        // Enable the miter array
        gl.enableVertexAttribArray(this.attribs.miter);
    }

    onDetach({gl}: Renderer){
        let column1 = this.attribs.model;
        let column2 = column1 + 1;
        let column3 = this.attribs.offset;

        // Disable instancing of 3x2 model matrix (because it affects global state)
        gl.vertexAttribDivisor(column1, 0);
        gl.vertexAttribDivisor(column2, 0);
        gl.vertexAttribDivisor(column3, 0);    
    }

    draw(renderer: Renderer, mesh: Mesh, matrices: Mat2dBuffer) {
        let {gl} = renderer;
        renderer.useProgram(this);
        this.loadProjection(gl, renderer.camera.matrix);
        this.loadColor(gl);
        this.loadLineWidth(gl);
        this.loadVertices(gl, mesh);
        this.loadMiters(gl, mesh);
        this.loadMatrices(gl, matrices);
        gl.drawElementsInstanced(gl.TRIANGLE_STRIP, mesh.strokeIndexCount, gl.UNSIGNED_SHORT, mesh.strokeIndexBufferOffset, matrices.length);
    }

    private loadProjection(gl: WebGLRenderingContext, projection: Float32Array) {
        gl.uniformMatrix4fv(this.uniforms.projection, false, projection);
    }

    private loadColor(gl: WebGLRenderingContext) {
        gl.uniform4fv(this.uniforms.fillColor, this.color.data);
    }

    /**
     * Sets the vertices used to draw the outline.
     */
    private loadVertices(gl: WebGLRenderingContext, src: Mesh) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.attribs.position, 2, gl.FLOAT, false, 0, src.strokeVertexBufferOffset);
    }

    /** Sets the matrix for each ellipse instance.*/
    private loadMatrices(gl: WebGLRenderingContext, matrices: Mat2dBuffer) {
        let column1 = this.attribs.model;
        let column2 = column1 + 1;
        let column3 = this.attribs.offset;

        // Load data into WebGL
        gl.bindBuffer(gl.ARRAY_BUFFER, this.matrixBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, matrices.data, gl.DYNAMIC_DRAW);

        // Set each column of the 3x2 model matrix
        gl.vertexAttribPointer(column1, 2, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(column2, 2, gl.FLOAT, false, 24, 8);
        gl.vertexAttribPointer(column3, 2, gl.FLOAT, false, 24, 16);
    }

    private loadMiters(gl: WebGLRenderingContext, mesh: Mesh){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.miterBuffer);
        gl.vertexAttribPointer(this.attribs.miter, 2, gl.FLOAT, false, 0, mesh.miterBufferOffset);
    }

    private loadLineWidth(gl: WebGLRenderingContext){
        gl.uniform1f(this.uniforms.lineWidth, this.lineWidth);
    }
}
