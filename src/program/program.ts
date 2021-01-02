import { Renderer } from '..';

/** Maps the name of a uniform to its location in a WebGL program. */
export interface UniformLocationMap {
    [key: string]: WebGLUniformLocation;
}

/** Maps the name of an attribute to its location in a WebGL program. */
export interface AttributeLocationMap {
    [key: string]: number;
}

export abstract class Program<U = UniformLocationMap, A = AttributeLocationMap> {

    /** The location of this program in WebGL. */
    location: WebGLProgram;

    /** The locations of the uniforms associated with this program, keyed by the uniform name. */
    uniforms: U;

    /** The locations of the attributes associated with this program, keyed by the attribute name. */
    attribs: A;

    /** Called whenever this program is attached to the renderer. */
    abstract onAttach(renderer: Renderer): any;

    /** Called whenever this program is detached from the renderer. */
    abstract onDetach(renderer: Renderer): any;
}
