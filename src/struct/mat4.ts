import { Rect } from '..';

/**
 * Creates an othogonal transformation matrix.
 * @param clip the near clipping plane viewport.
 * @param near the depth (negative z coordinate) of the near clipping plane.
 * @param far the depth (negative z coordinate) of the far clipping plane.
 */
export function ortho(clip: Rect.Like, near: number, far: number, out: Float32Array) {
    let width = Rect.width(clip),
        height = Rect.height(clip),
        depth = near - far;

    out[0] = 2 / width;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    out[4] = 0;
    out[5] = 2 / height;
    out[6] = 0;
    out[7] = 0;

    out[8] = 0;
    out[9] = 0;
    out[10] = 1 / depth;
    out[11] = 0;

    out[12] = -(clip.right + clip.left) / width;
    out[13] = -(clip.top + clip.bottom) / height;
    out[14] = -near / depth;
    out[15] = 1;
}
