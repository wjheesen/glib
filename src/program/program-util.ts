import { AttributeLocationMap, UniformLocationMap, Mesh, TypedArray } from "..";

export type ArraySize = number | BufferSource;
export type ElementArraySize = number | ArrayBuffer | Uint8Array | Uint16Array;

/** Maps the name of a uniform or attribute to it's minified renaming. */
export interface Renaming {
    [key: string]: string;
}

/** Contains convenience functions for creating programs and loading data into them. */
export class ProgramUtil {

    constructor(public gl: WebGLRenderingContext) { }

    createBuffer() {
        return this.gl.createBuffer();
    }

    /**
     * Creates an array buffer with the specified size.
     * @param size the size of the array buffer, or the initial data for the buffer.
     * @param usage one of gl.STATIC_DRAW (often used, seldom changed), gl.DYNAMIC_DRAW (often used, often changed), or gl.STREAM_DRAW (seldom used).
     */
    createArrayBuffer(size: ArraySize, usage = this.gl.STATIC_DRAW) {
        let gl = this.gl, buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, <any>size, usage);
        return buffer;
    }

    /**
     * Creates an element buffer with the specified size.
     * @param size the size of the element buffer, or the initial data for the buffer.
     * @param usage one of gl.STATIC_DRAW (often used, seldom changed), gl.DYNAMIC_DRAW (often used, often changed), or gl.STREAM_DRAW (seldom used).
     */
    createElementBuffer(size: ElementArraySize, usage = this.gl.STATIC_DRAW) {
        let gl = this.gl, buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, <any>size, usage);
        return buffer;
    }

    /** Packs mesh vertices into a single vertex buffer, saving the offsets. */
    createVertexBuffer(meshes: Mesh[]) {
        // Create an array buffer big enough to hold all the vertices
        let gl = this.gl;
        let size = this.sizeOfVertexBuffer(meshes);
        let buffer = this.createArrayBuffer(size, gl.STATIC_DRAW);

        // Pack the vertices into the buffer, saving the byte offsets
        let offset = 0;
        for (let mesh of meshes) {
            let data = mesh.vertices.data;
            gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
            mesh.vertexBufferOffset = offset;
            offset += data.byteLength;
        }

        return buffer;
    }

    private sizeOfVertexBuffer(meshes: Mesh[]) {
        return meshes.reduce((total: number, mesh: Mesh) => total + mesh.vertices.data.byteLength, 0);
    }

    /** Packs mesh indices into a single buffer, saving the offsets. */
    createIndexBuffer(meshes: Mesh[]) {

        // Create an array buffer big enough to hold all the indices
        let gl = this.gl;
        let size = this.sizeOfIndexBuffer(meshes)
        let buffer = this.createElementBuffer(size, gl.STATIC_DRAW);

        // Pack the indices into the buffer, saving the byte offsets
        let offset = 0;
        for (let mesh of meshes) {
            let data = mesh.indices;
            gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, data);
            mesh.indexBufferOffset = offset;
            offset += data.byteLength;
        }

        return buffer;
    }

    private sizeOfIndexBuffer(meshes: Mesh[]) {
        return meshes.reduce((total: number, mesh: Mesh) => total + mesh.indices.byteLength, 0);
    }

    createMiterBuffer(meshes: Mesh[]) {
        // Create an array buffer big enough to hold all the miters, including the "zero" miters used on the inner vertices
        let gl = this.gl;
        let size = this.sizeOfStrokeVertexBuffer(meshes);
        let buffer = this.createArrayBuffer(size);

        // Pack the vertices into the buffer, saving the byte offsets
        let offset = 0;
        let data: Float32Array;
        for (let mesh of meshes) {
            mesh.miterBufferOffset = offset;
            offset += mesh.vertices.data.byteLength; // leave zeros for miters applied to inner vertices
            data = mesh.miters.data;
            gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
            offset += data.byteLength; 
        }

        return buffer;
    }

    createStrokeIndexBuffer(meshes: Mesh[]) {
        // Ex: Let polygon p = [v0,v1,v2]
        // -> indexCount =  2 * (p.length + 1) = 2 * 2 * (3 + 1) = 8
        // -> indices = [[0,3], [1,4], [2,5], [0,3]]
        // -> size = sizeof(short) * indexCount = 2 bytes * 8 = 16 bytes

        // Create a Uint16Array big enough to hold all the indices
        let indexCount = this.lengthOfStrokeIndexArray(meshes);
        let indices = new Uint16Array(indexCount);
        let position = 0;

        for(let mesh of meshes){
            let vertexCount = mesh.vertices.length; 
            mesh.strokeIndexCount = 2 * (vertexCount + 1);
            mesh.strokeIndexBufferOffset = position * 2; // sizeof(short)
            // Line to each point on path
            for(let i = 0; i < vertexCount; i++){
                indices[position++] = i + vertexCount;
                indices[position++] = i;
            }
            // Close path
            indices[position++] = vertexCount;
            indices[position++] = 0;
        }

        return this.createElementBuffer(indices, this.gl.STATIC_DRAW);
    }

    private lengthOfStrokeIndexArray(meshes: Mesh[]) {
        return meshes.reduce((total: number, mesh: Mesh) => total + (2 * (mesh.vertices.length + 1)), 0);
    }

    createStrokeVertexBuffer(meshes: Mesh[]){
        // Create an array buffer big enough to hold all the vertices and all the miters
        let gl = this.gl;
        let size = this.sizeOfStrokeVertexBuffer(meshes);
        let buffer = this.createArrayBuffer(size);

        // Pack the vertices into the buffer, saving the byte offsets
        let offset = 0;
        for (let mesh of meshes) {
            // Inner vertices (will be offset by a "zero" miter)
            let data = mesh.vertices.data;
            gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
            mesh.strokeVertexBufferOffset = offset;
            // Outer vertices (will be offset by miter)
            offset += data.byteLength;
            gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
            offset += data.byteLength;
        }

        return buffer;
    }

    private sizeOfStrokeVertexBuffer(meshes: Mesh[]) {
        let innerVertexSize = this.sizeOfStrokeVertexBuffer(meshes);
        let outerVertexSize = meshes.reduce((total: number, m: Mesh) => total + m.miters.data.byteLength, 0);
        return innerVertexSize + outerVertexSize;
    }

    /**
     * Creates a program from 2 shaders.
     * @param  vertexShaderSource string containing code for the vertex shader.
     * @param  fragmentShaderSource string containing code for the fragment shader.
     * @returns the program.
     */
    createProgramFromSources(vertexShaderSource: string, fragmentShaderSource: string) {
        // Compile vertex and fragment shader
        let vs = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
        let fs = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
        // Create program and return
        return this.createProgramFromShaders(vs, fs);
    };

    /**
     * Creates a program from 2 shaders.
     * @param  vertexShader a compiled vertex shader.
     * @param  fragmentShader a compiled fragment shader.
     * @returns the program.
     */
    createProgramFromShaders(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        // create a program.
        let gl = this.gl, program = gl.createProgram();

        // attach the shaders.
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // link the program.
        gl.linkProgram(program);

        // Check if it linked.
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            // something went wrong with the link
            throw ("program filed to link:" + gl.getProgramInfoLog(program));
        }

        return program;
    };

    /**
     * Creates and compiles a shader.
     * @param shaderSource the GLSL source code for the shader.
     * @param shaderType the type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
     * @returns the shader.
     */
    compileShader(shaderSource: string, shaderType: number) {
        // Create the shader object
        let gl = this.gl, shader = gl.createShader(shaderType);

        // Set the shader source code.
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        // Check if it compiled
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            // Something went wrong during compilation; get the error
            throw "could not compile shader:" + gl.getShaderInfoLog(shader);
        }

        return shader;
    }

    /** Gets the location of each of the uniforms associated with the specified program. */
    getUniformLocationMap(program: WebGLProgram, renamed?: Renaming) {
        let gl = this.gl, uniforms = <UniformLocationMap>{};
        if (renamed) {
            for (let name in renamed) {
                uniforms[name] = gl.getUniformLocation(program, renamed[name]);
            }
        } else {
            let count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < count; i++) {
                let { name } = gl.getActiveUniform(program, i);
                uniforms[name] = gl.getUniformLocation(program, name);
            }
        }
        return uniforms;
    }

    /** Gets the location of each of the attributes associated with the specified program. */
    getAttributeLocationMap(program: WebGLProgram, renamed?: Renaming) {
        let gl = this.gl, attribs = <AttributeLocationMap>{};
        if (renamed) {
            for (let name in renamed) {
                attribs[name] = gl.getAttribLocation(program, renamed[name]);
            }
        } else {
            let count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < count; i++) {
                let { name } = gl.getActiveAttrib(program, i);
                attribs[name] = gl.getAttribLocation(program, name);
            }
        }
        return attribs;
    }
}
