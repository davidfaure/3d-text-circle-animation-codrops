import * as THREE from "three";

import { data } from "../utils/data";
import Text from "./text";

export default class Gallery {
  constructor({ renderer, scene, camera, sizes, gui }) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.sizes = sizes;
    this.gui = gui;

    this.group = new THREE.Group();

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.scrollCurrent = {
      y: 0,
      // x: 0
    };
    this.scroll = {
      y: 0,
      // x: 0
    };

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.createGeometry();
    this.createText();
    this.show();
  }

  createGeometry() {
    this.geometry = new THREE.BoxGeometry(1, 1, 20, 20);
  }

  createText() {
    this.texts = data.map((element, index) => {
      return new Text({
        element,
        scene: this.group,
        sizes: this.sizes,
        length: data.length,
        index,
      });
    });
  }

  show() {
    this.scene.add(this.group);
  }

  onTouchDown({ x, y }) {
    this.scrollCurrent.y = this.scroll.y;
  }

  onTouchMove({ x, y }) {
    const yDistance = y.start - y.end;

    this.y.target = this.scrollCurrent.y - yDistance;
  }

  onTouchUp({ x, y }) {}

  onWheel({ pixelX, pixelY }) {
    this.y.target -= pixelY;
  }

  onResize({ sizes }) {
    this.sizes = sizes;

    this.texts.forEach((text) => text.onResize(sizes));
  }

  update() {}
}
