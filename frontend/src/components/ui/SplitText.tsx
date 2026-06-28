"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface SplitTextProps {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  delay?: number;
  stagger?: number;
  type?: "words" | "chars" | "lines";
  once?: boolean;
}

export function SplitTextReveal({
  text,
  className = "",
  tag: Tag = "h1",
  delay = 0,
  stagger = 0.04,
  type = "words",
  once = true,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Split کردن متن به span
    const units = type === "chars"
      ? text.split("")
      : type === "words"
      ? text.split(" ")
      : [text];

    el.innerHTML = units
      .map(
        (unit) =>
          `<span style="display:inline-block; overflow:hidden; vertical-align:bottom;">` +
          `<span class="split-inner" style="display:inline-block; transform:translateY(110%);">` +
          `${unit}${type === "words" ? "&nbsp;" : ""}` +
          `</span></span>`
      )
      .join(type === "chars" ? "" : "");

    const inners = el.querySelectorAll<HTMLElement>(".split-inner");

    const animate = () => {
      if (once && animated.current) return;
      animated.current = true;

      gsap.to(inners, {
        y: 0,
        duration: 1,
        ease: "power4.out",
        stagger,
        delay,
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animate();
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [text, delay, stagger, type, once]);

  return (
    <Tag
      ref={containerRef as React.Ref<never>}
      className={className}
      aria-label={text}
    />
  );
}