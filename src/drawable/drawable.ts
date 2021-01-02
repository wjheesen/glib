import { Renderer } from '..';

export interface Drawable {
    draw(renderer: Renderer): void;
}