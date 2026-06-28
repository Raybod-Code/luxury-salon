"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: "power2.out" });
    };

    // ring با تاخیر دنبال می‌کند
    const tick = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(tick);
    };
    const rafId = requestAnimationFrame(tick);

    // hover روی لینک / دکمه
    const onEnterLink = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const cursorLabel = el.dataset.cursor ?? "";

      gsap.to(ring, { scale: 2.2, borderColor: "var(--color-gold)", duration: 0.35, ease: "power3.out" });
      gsap.to(dot,  { scale: 0,   duration: 0.2 });

      if (cursorLabel) {
        label.textContent = cursorLabel;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.25 });
      }
    };

    const onLeaveLink = () => {
      gsap.to(ring, { scale: 1, borderColor: "var(--color-primary)", duration: 0.35, ease: "power3.out" });
      gsap.to(dot,  { scale: 1, duration: 0.2 });
      gsap.to(label,{ opacity: 0, scale: 0.8, duration: 0.2 });
    };

    // hover روی تصویر → "VIEW"
    const onEnterImage = () => {
      label.textContent = "VIEW";
      gsap.to(ring,  { scale: 3.5, borderColor: "transparent", backgroundColor: "var(--color-primary)", duration: 0.4, ease: "power3.out" });
      gsap.to(dot,   { scale: 0, duration: 0.2 });
      gsap.to(label, { opacity: 1, scale: 1, duration: 0.25 });
    };

    const onLeaveImage = () => {
      gsap.to(ring,  { scale: 1, backgroundColor: "transparent", borderColor: "var(--color-primary)", duration: 0.4, ease: "power3.out" });
      gsap.to(dot,   { scale: 1, duration: 0.2 });
      gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
    };

    // mouse down / up
    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.15 });
    const onUp   = () => gsap.to(ring, { scale: 1,   duration: 0.25, ease: "power2.out" });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    const addListeners = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
      document.querySelectorAll("[data-cursor-image]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterImage);
        el.addEventListener("mouseleave", onLeaveImage);
      });
    };

    // observer برای المان‌های dynamic
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addListeners();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot — مرکز دقیق */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "var(--color-primary)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
        }}
      />

      {/* Ring — با تاخیر */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid var(--color-primary)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s ease",
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: "#fff",
            opacity: 0,
            transform: "scale(0.8)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        />
      </div>
    </>
  );
}