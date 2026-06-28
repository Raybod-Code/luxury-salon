"use client";

import { useRef, ReactNode, MouseEvent } from "react";
import { gsap } from "gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  "data-cursor"?: string;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  onClick,
  ...props
}: MagneticButtonProps) {
  const btnRef  = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    const inner = innerRef.current;
    if (!btn || !inner) return;

    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;

    gsap.to(btn,   { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    gsap.to(inner, { x: dx * 0.4, y: dy * 0.4, duration: 0.4, ease: "power2.out" });
  };

  const onLeave = () => {
    gsap.to(btnRef.current,   { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <button
      ref={btnRef}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      {...props}
    >
      <span ref={innerRef} style={{ display: "contents" }}>
        {children}
      </span>
    </button>
  );
}