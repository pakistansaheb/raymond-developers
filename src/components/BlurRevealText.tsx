"use client";

import { useEffect, useRef } from "react";

const MAX_BLUR_PX = 10;
// Archivo is loaded as a full variable-weight font (src/lib/fonts.ts,
// 400-800), so weight can be interpolated continuously right alongside
// blur/opacity — starts light/regular, ends bold, matching the
// reliabuilds effect rather than staying a fixed weight throughout.
const START_WEIGHT = 400;
const END_WEIGHT = 750;
// A word is fully blurred once its center is at/below REVEAL_BOTTOM of the
// viewport, and fully sharp once its center reaches REVEAL_TOP — scrolling
// down sweeps that band up through the text, sharpening it word by word as
// it goes, rather than the whole block firing at once. A wider band means
// more scroll distance to go from blurred to sharp — i.e. slower, gentler.
const REVEAL_BOTTOM = 0.92;
const REVEAL_TOP = 0.4;

/**
 * Continuously scroll-linked blur reveal: every word starts blurred and
 * light-weight, and sharpens + bolds in place as it's scrolled up through a
 * band of the viewport — not a one-shot IntersectionObserver trigger.
 * Driven by inline styles set per animation frame (cheap for a single
 * paragraph's worth of words), rather than the
 * [data-blur-reveal]/.is-revealed CSS-class toggle used elsewhere, since
 * this needs continuous, not binary, state.
 */
export function BlurRevealText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const items = Array.from(
      node.querySelectorAll<HTMLElement>("[data-blur-reveal]"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const item of items) {
        item.style.opacity = "1";
        item.style.filter = "none";
        item.style.fontWeight = String(END_WEIGHT);
      }
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const bottomY = vh * REVEAL_BOTTOM;
      const topY = vh * REVEAL_TOP;

      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const progress = Math.min(
          Math.max((bottomY - centerY) / (bottomY - topY), 0),
          1,
        );
        item.style.opacity = String(progress);
        item.style.filter = `blur(${(1 - progress) * MAX_BLUR_PX}px)`;
        item.style.fontWeight = String(
          Math.round(START_WEIGHT + (END_WEIGHT - START_WEIGHT) * progress),
        );
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
