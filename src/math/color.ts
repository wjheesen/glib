import { pad, randomByte } from "./util";

export interface ColorLike {
    /** The red component of this color, a value between 0 and 0xff */
    r: number;
    /** The green component of this color, a value between 0 and 0xff */
    g: number;
    /** The blue component of this, a value between 0 and 0xff */
    b: number;
    /** The alpha component of this color, a value between 0 and 0xff */
    a: number;
}

/** Copies a color */
export function copy(c: ColorLike, out = <ColorLike> {}) {
    out.r = c.r;
    out.g = c.g;
    out.b = c.b;
    out.a = c.a;
    return out;
}

/** Converts an 0xrrggbbaa int to a color */
export function fromRgbaInt(rgba: number, out = <ColorLike> {}) {
    out.r = (rgba >> 24) & 0xff;
    out.g = (rgba >> 16) & 0xff;
    out.b = (rgba >> 8) & 0xff;
    out.a = (rgba >> 0) & 0xff;
    return out;
}

/** Converts an 0xrrggbb int to a (fully opaque) color */
export function fromRgbInt(rgb: number, out = <ColorLike> {}) {
    return fromRgbaInt((rgb << 8) | 0xff, out);
}

/** Converts a color to an 0xrrggbbaa int */
export function toRgbaInt(c: ColorLike) {
    let r = c.r << 24;
    let g = c.g << 16;
    let b = c.b << 8;
    let a = c.a << 0;
    return (r | g | b | a) >>> 0; // Convert to unsigned
}

/** Converts an #aarrggbb string to a color. The leading # is optional. */
export function fromArgbString(argb: string, out = <ColorLike> {}) {
    let i = argb[0] == '#' ? 1 : 0;
    out.a = parseInt(argb.substr(i, 2), 16);
    out.r = parseInt(argb.substr(i + 2, 2), 16);
    out.g = parseInt(argb.substr(i + 4, 2), 16);
    out.b = parseInt(argb.substr(i + 6, 2), 16);
    return out;
}

/** Converts a color to an #aarrggbb string. */
export function toArgbString(c: ColorLike) {
    let a = pad(c.a.toString(16)); // aa
    let r = pad(c.r.toString(16)); // rr
    let g = pad(c.g.toString(16)); // gg
    let b = pad(c.b.toString(16)); // bb
    return '#' + a + r + g + b; // #aarrggbb
}

/** Creates a random color. Preserves the alpha value of the out param if specified; otherwise defaults to fully opaque */
export function random(out = <ColorLike> {}) {
    out.r = randomByte();
    out.g = randomByte();
    out.b = randomByte();
    out.a = out.a === undefined ? 0xff : out.a;
    return out;
}

/** Blends src into dst using (src.alpha, 1-src.alpha) blend mode */
export function blend(src: ColorLike, dst: ColorLike, out = <ColorLike> {}) {
    let alpha = src.a + 1, invAlpha = 256 - src.a;
    out.r = (alpha * src.r + invAlpha * dst.r) >> 8; // divide by 2^8
    out.g = (alpha * src.g + invAlpha * dst.g) >> 8;
    out.b = (alpha * src.b + invAlpha * dst.b) >> 8;
    out.a = dst.a;
    return out;
}

/** Checks if a color is fully opaque */
export function isOpaque(c: ColorLike) {
    return c.a === 0xff;
}

/** Checks if a color is fully transparent */
export function isTransparent(c: ColorLike) {
    return c.a === 0;
}

/** Checks if c1 and c2 are equal */
export function equals(c1: ColorLike, c2: ColorLike) {
    return c1.r == c2.r
        && c1.g == c2.g
        && c1.b == c2.b
        && c1.a == c2.a;
}