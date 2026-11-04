"use client";

import { useEffect, useRef } from "react";

export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
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
        if (entries.some((entry) => entry.isIntersecting)) {
          for (const item of items) item.classList.add("is-revealed");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
