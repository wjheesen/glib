export interface Uniforms {
    readonly [name: string]: WebGLUniformLocation;
    projection: WebGLUniformLocation;
    lineWidth: WebGLUniformLocation;
    color: WebGLUniformLocation;
}

export interface Attributes {
    readonly [name: string]: number;
    model: number;
    offset: number;
}

export type Variables = Uniforms|Attributes;

export const vertex = "precision mediump float;uniform mat4 v;uniform float j;attribute mat2 b;attribute vec2 k,l,m;mat2 f(float a){float c=sin(a),d=cos(a);return mat2(d,c,-c,d);}void main(){float a=b[0].x,c=b[1].x,d=b[0].y,e=b[1].y,n=a+e,o=a-e,p=d+c,q=d-c,g=atan(p,o),h=atan(q,n),r=(h-g)/2.,s=(h+g)/2.;mat2 i=f(s),t=f(r);i[1]*=sign(a*e-c*d);vec2 u=i*(j*(t*m)),w=b*l+k+u;gl_Position=v*vec4(w,1.,1.);}", fragment = "precision mediump float;uniform vec4 x;void main(){gl_FragColor=x;}", attributeRenaming = {"projection":"v","lineWidth":"j","color":"x"}, uniformRenaming = {"projection":"v","lineWidth":"j","color":"x"};
