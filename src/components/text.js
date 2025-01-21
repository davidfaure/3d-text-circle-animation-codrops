import * as THREE from "three";
import { MSDFTextGeometry, uniforms } from "three-msdf-text-utils";

import atlasURL from "../assets/Neuton-Regular.png";
import fnt from "../assets/Neuton-Regular-msdf.json";

import vertex from "../shaders/text-vertex.glsl";
import fragment from "../shaders/text-fragment.glsl";

export default class Text {
  constructor({ element, scene, sizes, index, circleSpeed, length }) {
    this.element = element;
    this.scene = scene;
    this.sizes = sizes;
    this.index = index;
    this.length = length;
    this.circleSpeed = circleSpeed;

    this.scale = 0.01;
    this.numberOfText = this.length;
    this.angleCalc = ((this.numberOfText / 10) * Math.PI) / this.numberOfText;

    this.load();
  }

  load() {
    Promise.all([this.loadFontAtlas(atlasURL)]).then(([atlas]) => {
      const geometry = new MSDFTextGeometry({
        text: this.element.title,
        font: fnt,
      });

      const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true,
        defines: {
          IS_SMALL: false,
        },
        extensions: {
          derivatives: true,
        },
        uniforms: {
          // custom
          uColorBlack: { value: new THREE.Vector3(0.133, 0.133, 0.133) },
          // Common
          ...uniforms.common,
          // Rendering
          ...uniforms.rendering,
          // Strokes
          ...uniforms.strokes,
        },
        vertexShader: vertex,
        fragmentShader: fragment,
      });
      material.uniforms.uMap.value = atlas;

      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);
      this.createBounds({
        sizes: this.sizes,
      });
    });
  }

  loadFontAtlas(path) {
    const promise = new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(path, resolve);
    });

    return promise;
  }

  createBounds({ sizes }) {
    if (this.mesh) {
      this.updateScale();
      this.updateZ();
      this.updateX();
      this.updateY();
    }
  }

  updateZ(z = 0) {
    this.mesh.rotation.z = (this.index / this.numberOfText) * 2 * Math.PI - z;
  }

  updateX(x = 0) {
    this.angleX = this.index * this.angleCalc - x;
    this.mesh.position.x = Math.cos(this.angleX);
  }

  updateY(y = 0) {
    this.angleY = this.index * this.angleCalc - y;
    this.mesh.position.y = Math.sin(this.angleY);
  }

  updateScale() {
    this.mesh.scale.set(this.scale, -this.scale, this.scale);
  }

  onResize(sizes) {
    this.sizes = sizes;
    this.createBounds({
      sizes: this.sizes,
    });
  }

  update(scroll, circleSpeed, speed) {
    this.circleSpeed = circleSpeed;
    if (this.mesh) {
      this.updateY(scroll.y * this.circleSpeed);
      this.updateX(scroll.y * this.circleSpeed);
      this.updateZ(scroll.y * this.circleSpeed);
    }
  }
}
