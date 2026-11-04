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

    // Observed one by one: on a tall phone layout a section-level trigger
    // would finish animating items long before they reach the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, index) => {
            const item = entry.target as HTMLElement;
            item.style.setProperty("--reveal-index", String(index));
            item.classList.add("is-revealed");
            observer.unobserve(item);
          });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    node
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
