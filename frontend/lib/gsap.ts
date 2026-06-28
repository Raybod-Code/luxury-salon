"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
}

export { gsap, ScrollTrigger, SplitText };

/* ── Reusable animation presets ── */

export const fadeUpPreset = {
  from: { opacity: 0, y: 40, filter: "blur(4px)" },
  to: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 1,
    ease: "power3.out",
  },
};

export const fadeInPreset = {
  from: { opacity: 0 },
  to: { opacity: 1, duration: 0.8, ease: "power2.out" },
};

export const clipRevealPreset = {
  from: { clipPath: "inset(0 100% 0 0)" },
  to: {
    clipPath: "inset(0 0% 0 0)",
    duration: 1.2,
    ease: "power4.inOut",
  },
};

export const scaleInPreset = {
  from: { opacity: 0, scale: 0.92 },
  to: { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
};

/**
 * ScrollTrigger helper — attach to any element
 */
export function createScrollReveal(
  element: Element | string,
  animation: { from: gsap.TweenVars; to: gsap.TweenVars },
  triggerOptions?: ScrollTrigger.Vars
) {
  return gsap.fromTo(element, animation.from, {
    ...animation.to,
    scrollTrigger: {
      trigger: element,
      start: "top 88%",
      once: true,
      ...triggerOptions,
    },
  });
}