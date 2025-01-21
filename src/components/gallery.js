import * as THREE from "three";

import { data } from "../utils/data";
import { lerp } from "../utils/math";
import Text from "./text";

export default class Gallery {
  constructor({ renderer, scene, camera, sizes, gui }) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.sizes = sizes;
    this.gui = gui;

    this.group = new THREE.Group();

    this.circleSpeed = 0.0007;
    this.amplitude = 0.004;

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

    this.gui.add(this, "circleSpeed").min(0).max(0.002).step(0.0001);
    this.gui.add(this, "amplitude").min(0).max(0.01).step(0.001);
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
        circleSpeed: this.circleSpeed,
        amplitude: this.amplitude,
        index,
      });
    });
  }

  show() {
    this.scene.add(this.group);
  }

  onTouchDown({ y }) {
    this.scrollCurrent.y = this.scroll.y;
  }

  onTouchMove({ y }) {
    const yDistance = y.start - y.end;

    this.y.target = this.scrollCurrent.y - yDistance;
  }

  onTouchUp({ y }) {}

  onWheel({ pixelY }) {
    this.y.target -= pixelY;
  }

  onResize({ sizes }) {
    this.sizes = sizes;

    this.group.position.x = -this.sizes.width / 2;

    this.texts.forEach((text) => text.onResize(sizes));
  }

  update() {
    this.y.current = lerp(this.y.current, this.y.target, this.y.lerp);

    this.scroll.y = this.y.current;

    this.speed.target = (this.y.target - this.y.current) * 0.001;
    this.speed.current = lerp(
      this.speed.current,
      this.speed.target,
      this.speed.lerp
    );

    this.texts.map((text) =>
      text.update(
        this.scroll,
        this.circleSpeed,
        this.speed.current,
        this.amplitude
      )
    );
  }
}
