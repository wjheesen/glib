import { Program, ColorfBuffer, Mesh, Renderer, ProgramUtil, Mat2dBuffer, Vec2Buffer } from "..";
import * as Shader from './fill-shader'

/**  Program for rendering polygons filled with a uniform color. */
export class FillProgram extends Program<Shader.Uniforms, Shader.Attributes> {

    public color: ColorfBuffer;

    private indexBuffer: WebGLBuffer;
    private positionBuffer: WebGLBuffer;
    private matrixBuffer: WebGLBuffer;
    private dynamicBuffer: WebGLBuffer;
    
    static create(util: ProgramUtil, meshes: Mesh[]) {
        let program = new FillProgram;
        program.location = util.createProgramFromSources(Shader.vertex, Shader.fragment);
        program.uniforms = util.getUniformLocationMap(program.location, Shader.uniformRenaming) as Shader.Uniforms;
        program.attribs = util.getAttributeLocationMap(program.location, Shader.attributeRenaming) as Shader.Attributes;
        program.indexBuffer = util.createIndexBuffer(meshes);
        program.positionBuffer = util.createVertexBuffer(meshes);
        program.matrixBuffer = util.createBuffer();
        program.dynamicBuffer = util.createBuffer();
        return program;
    }

    onAttach({ gl, angleExt }: Renderer) {
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
        angleExt.vertexAttribDivisorANGLE(column1, 1); 
        angleExt.vertexAttribDivisorANGLE(column2, 1);
        angleExt.vertexAttribDivisorANGLE(column3, 1);
    }

    onDetach({angleExt}: Renderer){
        let column1 = this.attribs.model;
        let column2 = column1 + 1;
        let column3 = this.attribs.offset;

        // Disable instancing of 3x2 model matrix (because it affects global state)
        angleExt.vertexAttribDivisorANGLE(column1, 0);
        angleExt.vertexAttribDivisorANGLE(column2, 0);
        angleExt.vertexAttribDivisorANGLE(column3, 0);    
    }

    draw(renderer: Renderer, mesh: Mesh, matrices: Mat2dBuffer) {
        let {gl, angleExt} = renderer;
        renderer.useProgram(this);
        this.loadProjection(gl, renderer.camera.matrix);
        this.loadColor(gl);
        this.loadVertices(gl, mesh);
        this.loadMatrices(gl, matrices);
        if (mesh.indices) {
            angleExt.drawElementsInstancedANGLE(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, mesh.indexBufferOffset, matrices.length)
        } else {
            angleExt.drawArraysInstancedANGLE(gl.TRIANGLES, 0, mesh.vertices.length, matrices.length);
        }
    }

    drawTriangleStrip(renderer: Renderer, vertices: Vec2Buffer, matrices: Mat2dBuffer) {
        let { gl, angleExt } = renderer;
        renderer.useProgram(this);
        this.loadProjection(gl, renderer.camera.matrix);
        this.loadColor(gl);
        this.loadLineVertices(gl, vertices);
        this.loadMatrices(gl, matrices);
        angleExt.drawArraysInstancedANGLE(gl.TRIANGLE_STRIP, 0, vertices.length, matrices.length);
    }

    private loadProjection(gl: WebGLRenderingContext, projection: Float32Array) {
        gl.uniformMatrix4fv(this.uniforms.projection, false, projection);
    }

    /** Loads the fill color into this program. */
    private loadColor(gl: WebGLRenderingContext) {
        gl.uniform4fv(this.uniforms.color, this.color.data);
    }

    private loadVertices(gl: WebGLRenderingContext, mesh: Mesh) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.attribs.position, 2, gl.FLOAT, false, 0, mesh.vertexBufferOffset);
    }

    private loadLineVertices(gl: WebGLRenderingContext, vertices: Vec2Buffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.dynamicBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices.data, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.attribs.position, 2, gl.FLOAT, false, 0, 0);
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
}
