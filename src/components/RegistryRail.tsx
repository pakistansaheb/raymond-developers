"use client";

import { useEffect, useState } from "react";

const ENTRIES = [
  { code: "01", label: "Hero" },
  { code: "02", label: "Capability" },
  { code: "03", label: "Work" },
  { code: "04", label: "Process" },
  { code: "05", label: "Start" },
  { code: "06", label: "FAQ" },
  { code: "07", label: "Contact" },
] as const;

/**
 * The signature element. A fixed hairline rail listing every section as
 * 01–07 — the page's table of contents, kept live against scroll position.
 * Every in-page numbering scheme (capability rows, FAQ rows) is a sub-code
 * of one of these entries, so the numbers describe real position in the
 * document rather than decorating it.
 *
 * Collapses to a 1px top progress hairline below the width where a fixed
 * side rail would crowd the content column.
 */
export function RegistryRail() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = ENTRIES.map((entry) =>
      document.getElementById(entry.code),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sections.findIndex((s) => s === entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    for (const section of sections) {
      if (section) observer.observe(section);
    }

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Collapsed form: a 1px progress hairline for narrower viewports. */}
      <div
        className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-hairline xl:hidden"
        aria-hidden="true"
      >
        <div
          className="h-full bg-signal transition-[width] duration-150"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>

      {/* Full rail: fixed to the left edge, visible from xl up only. */}
      <nav
        aria-label="Page sections"
        className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
      >
        {ENTRIES.map((entry, index) => {
          const active = index === activeIndex;
          return (
            <a
              key={entry.code}
              href={`#${entry.code}`}
              className="group flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className={`block h-[3px] transition-all duration-300 ${
                  active ? "w-6 bg-signal" : "w-3 bg-hairline group-hover:bg-graphite"
                }`}
              />
              <span
                className={`t-mono whitespace-nowrap transition-all duration-300 ${
                  active
                    ? "max-w-[140px] text-chalk opacity-100"
                    : "max-w-0 overflow-hidden text-graphite opacity-0 group-hover:max-w-[140px] group-hover:opacity-100"
                }`}
              >
                {entry.code} {entry.label}
              </span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
