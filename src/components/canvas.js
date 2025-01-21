import * as THREE from "three";
import GUI from "lil-gui";
import Gallery from "./gallery";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Canvas {
  constructor() {
    this.element = document.getElementById("webgl");
    this.time = 0;

    this.y = {
      start: 0,
      distance: 0,
      end: 0,
    };

    this.createClock();

    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createGallery();
    this.createDebug();
  }

  createDebug() {
    this.gui = new GUI();
    this.debug = {};
  }

  createClock() {
    this.clock = new THREE.Clock();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.element,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  createGallery() {
    this.gallery = new Gallery({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      sizes: this.sizes,
      gui: this.gui,
    });
  }

  onTouchDown(event) {
    this.isDown = true;
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    if (!this.isDown) return;

    this.y.end = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchUp(event) {
    this.isDown = false;

    this.y.end = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY;
  }

  onWheel(event) {}

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.sizes = {
      width,
      height,
    };

    if (this.gallery)
      this.gallery.onResize({
        sizes: this.sizes,
      });
  }

  update() {
    if (this.gallery) this.gallery.update();

    this.renderer.render(this.scene, this.camera);
  }
}
