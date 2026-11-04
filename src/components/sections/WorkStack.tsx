"use client";

import { useEffect, useRef } from "react";

export function WorkStack({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stacked = window.matchMedia("(max-width: 767px)");
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".work-card"));
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      cards.forEach((card, i) => {
        const inner = card.firstElementChild as HTMLElement | null;
        const next = cards[i + 1];
        if (!inner) return;
        if (!stacked.matches || !next) {
          inner.style.removeProperty("--cover");
          return;
        }
        const stickTop = parseFloat(getComputedStyle(card).top) || 0;
        const cover = (vh - next.getBoundingClientRect().top) / (vh - stickTop);
        inner.style.setProperty(
          "--cover",
          String(Math.min(Math.max(cover, 0), 1)),
        );
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
