import * as THREE from "three";
import { MSDFTextGeometry, uniforms } from "three-msdf-text-utils";

import atlasURL from "../assets/Neuton-Regular.png";
import fnt from "../assets/Neuton-Regular-msdf.json";

import vertex from "../shaders/text-vertex.glsl";
import fragment from "../shaders/text-fragment.glsl";

export default class Text {
  constructor({ element, scene, sizes, index, length }) {
    this.element = element;
    this.scene = scene;
    this.sizes = sizes;
    this.index = index;
    this.length = length;

    this.scale = 0.01;
    this.numberOfText = this.length;
    this.angle = ((this.numberOfText / 10) * Math.PI) / this.numberOfText;

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

  updateZ() {}

  updateX() {}

  updateY() {
    this.mesh.position.y += this.index * 0.5;
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
}
