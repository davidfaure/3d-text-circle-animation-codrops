import gsap from "gsap";

export function lerp(p1, p2, t) {
  return gsap.utils.interpolate(p1, p2, t);
}

export function clamp(min, max, number) {
  return GSAP.utils.clamp(min, max, number);
}
