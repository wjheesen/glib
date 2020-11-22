import { ColorLike } from './color';

// These functions are the same
export { copy, isTransparent } from './color'; 

/** Checks if c1 and c2 are approximately equal */
export function equals(c1: ColorLike, c2: ColorLike, e = 0) {
    return Math.abs(c1.r - c2.r) <= e
        && Math.abs(c1.g - c2.g) <= e
        && Math.abs(c1.b - c2.b) <= e;
}

/** Converts a byte-based rgba color to a float-based rgba color */
export function fromColor(src: ColorLike, out = <ColorLike> {}){
    out.r = src.r / 0xff;
    out.g = src.g / 0xff;
    out.b = src.b / 0xff;
    out.a = src.a / 0xff;
    return out;
}

/** Converts a float-based rgba color to a byte-based rgba color */
export function toColor(src: ColorLike, out = <ColorLike> {}){
    out.r = (src.r * 0xff) >> 0;
    out.g = (src.g * 0xff) >> 0;
    out.b = (src.b * 0xff) >> 0;
    out.a = (src.a * 0xff) >> 0;
    return out;
}

/** Creates a random color. Preserves the alpha value of the out param if specified; otherwise defaults to fully opaque */
export function random(out = <ColorLike> {}) {
    out.r = Math.random();
    out.g = Math.random();
    out.b = Math.random();
    out.a = out.a === undefined ? 1 : out.a;
    return out;
}

/** Checks if a color is fully opaque */
export function isOpaque(c: ColorLike) {
    return c.a === 1;
}

/** Premultiplies the (r,g,b) components of a color by it's alpha component */
export function premultiplyAlpha(c: ColorLike, out = <ColorLike> {}) {
    out.r = c.r * c.a;
    out.g = c.g * c.a;
    out.b = c.b * c.a;
    out.a = 1;
    return out;
}