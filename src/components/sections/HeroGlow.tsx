"use client";

import { useEffect, useRef } from "react";

/**
 * A restrained, low-opacity radial light that tracks the pointer, confined
 * to the Hero section (id="01") only — never a page-wide cursor effect.
 * Skipped entirely on touch-only devices (no fine pointer to track) and
 * under prefers-reduced-motion. Positioning is done via a CSS custom
 * property updated directly on the node in the pointermove handler, not
 * React state, so it never triggers a re-render on every mouse move.
 */
export function HeroGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!canHover || reduceMotion) return;

    const section = document.getElementById("01");
    const glow = glowRef.current;
    if (!section || !glow) return;

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      glow.style.setProperty("--glow-x", `${x}%`);
      glow.style.setProperty("--glow-y", `${y}%`);
      glow.style.opacity = "1";
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in srgb, var(--color-signal) 6%, transparent), transparent 70%)",
      }}
    />
  );
}
