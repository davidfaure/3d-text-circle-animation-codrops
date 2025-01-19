import NormalizeWheel from "normalize-wheel";
import AutoBind from "auto-bind";

import Canvas from "./components/canvas";

class App {
  constructor() {
    AutoBind(this);

    this.init();
    this.update();
    this.onResize();
    this.addEventListeners();
  }

  init() {
    this.canvas = new Canvas();
  }

  update() {
    this.canvas.update();
    requestAnimationFrame(this.update.bind(this));
  }

  onResize() {
    window.requestAnimationFrame(() => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize();
      }
    });
  }

  onTouchDown(event) {
    event.stopPropagation();
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    event.stopPropagation();
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event);
    }
  }

  onTouchUp(event) {
    event.stopPropagation();

    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event);
    }
  }

  onWheel(event) {
    const normalizedWheel = NormalizeWheel(event);

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel);
    }
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("mousedown", this.onTouchDown, {
      passive: true,
    });
    window.addEventListener("mouseup", this.onTouchUp, { passive: true });
    window.addEventListener("pointermove", this.onTouchMove, {
      passive: true,
    });
    window.addEventListener("touchstart", this.onTouchDown, {
      passive: true,
    });
    window.addEventListener("touchmove", this.onTouchMove, {
      passive: true,
    });
    window.addEventListener("touchend", this.onTouchUp, { passive: true });
    window.addEventListener("wheel", this.onWheel, { passive: true });
  }
}

export default new App();
