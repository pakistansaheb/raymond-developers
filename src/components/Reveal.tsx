"use client";

import { useEffect, useRef } from "react";

/**
 * One orchestrated reveal per section: everything inside fades and lifts
 * together on a short stagger driven by `--reveal-index` (see globals.css),
 * rather than each element animating independently. Respects
 * prefers-reduced-motion via the CSS itself — this component only ever adds
 * the class that starts the transition.
 */
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const items = Array.from(
      node.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    items.forEach((item, index) => {
      item.style.setProperty("--reveal-index", String(index));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            for (const item of items) item.classList.add("is-revealed");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as "div";
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
