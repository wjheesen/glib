export interface Uniforms {
    readonly [name: string]: WebGLUniformLocation;
    projection: WebGLUniformLocation;
    color: WebGLUniformLocation;
}

export interface Attributes {
    readonly [name: string]: number;
    model: number;
    offset: number;
    position: number;
}

export type Variables = Uniforms|Attributes;

export const vertex = "precision mediump float;uniform mat4 d;attribute mat2 a;attribute vec2 b,c;void main(){vec2 e=a*c+b;gl_Position=d*vec4(e,1.,1.);}", fragment = "precision mediump float;uniform vec4 f;void main(){gl_FragColor=f;}", attributeRenaming = {"model":"a","offset":"b","position":"c"}, uniformRenaming = {"projection":"d","color":"f"};
