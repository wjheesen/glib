export interface Uniforms {
    readonly [name: string]: WebGLUniformLocation;
    projection: WebGLUniformLocation;
    lineWidth: WebGLUniformLocation;
    fillColor: WebGLUniformLocation;
    strokeColor: WebGLUniformLocation;
}

export interface Attributes {
    readonly [name: string]: number;
    model: number;
    offset: number;
    position: number;
}

export type Variables = Uniforms|Attributes;

export const vertex = "precision mediump float;uniform mat4 z;uniform float s;attribute mat2 c;attribute vec2 v,h;varying vec2 f,e;mat2 i(float a){float b=sin(a),d=cos(a);return mat2(d,b,-b,d);}void main(){float j=c[0].x,k=c[1].x,l=c[0].y,m=c[1].y,a=(j+m)/2.,b=(j-m)/2.,d=(l+k)/2.,g=(l-k)/2.,n=sqrt(a*a+g*g),o=sqrt(b*b+d*d),A=n+o,p=n-o,q=atan(d,b),r=atan(g,a),w=(r-q)/2.,x=(r+q)/2.;mat2 t=i(x),u=i(w);t[1]*=sign(p),p=abs(p);vec2 y=t*(s*(u*h)),B=c*h+v+y;gl_Position=z*vec4(B,1.,1.),e=u*h,f=e*(1.+s/vec2(A,p));}", fragment = "precision mediump float;uniform vec4 C,D;varying vec2 f,e;void main(){bool a=dot(f,f)<1.,b=dot(e,e)<1.;gl_FragColor=a?C:b?D:vec4(0.);}", attributeRenaming = {"model":"c","offset":"v","position":"h"}, uniformRenaming = {"projection":"z","lineWidth":"s","fillColor":"C","strokeColor":"D"};
