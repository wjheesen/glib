import { expect } from "chai";
import { Rect, Vec2 } from ".."
import { Camera } from "./camera"

describe('Camera', () => {
    let world = Rect.dimensions(-1, 1, 2, 2);
    let camera = new Camera(world, 1, 10);

    describe('#setViewport()', () => {
        it('adjusts the area in view to match the aspect of the viewport', () => {
            camera.setViewport(200, 100);
            expect(camera.view.aspect).to.equal(2);
        });
    });

    describe('#offset()', () => {
        it('moves the camera, restricting the position to prevent the camera from seeing outside the world', () => {
            let view = Rect.copy(camera.view);
            let actual = camera.offset({x: 2, y: -2});
            view.offset(actual);
            expect(world.containsPoint(camera.position));
            expect(view).deep.equals(camera.view);
        })
    })

    describe('#zoomIn()', () => {
        it('causes the camera to focus on a smaller area, respecting the max zoom constraint', () => {
            let area = camera.view.area;
            let pos = Vec2.copy(camera.position);
            let actual = camera.zoomIn(22);
            expect(camera.view.area).approximately(area / (actual * actual), 0.0001);
            expect(camera.maxZoom).to.equal(camera.zoom);
            expect(camera.position).deep.equals(pos);
        })
    })

    describe('#zoomToPoint()', () => {
        it('zooms the camera towards the specified point', () => {
            let area = camera.view.area;
            let pos = Vec2.copy(camera.position);
            let {scale, offset} = camera.zoomToPoint(2, {x: 0.5, y: 0.5});
            expect(camera.view.area).approximately(area / (scale * scale), 0.0001);
            expect(camera.position).deep.equals(Vec2.add(offset, pos));
            expect(camera.world.containsPoint(camera.position));
        })
    })
})