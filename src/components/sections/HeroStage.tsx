"use client";

import { useEffect, useRef, useState } from "react";

import { ProjectShot } from "@/components/ProjectShot";
import { PROJECTS } from "@/lib/projects";

// Pinned scroll deck. The first fifth of the scroll opens the stage (side
// frames fly out, the first site grows to full size); the rest deals every
// client site onto the pile, one per stretch of scroll, with the caption
// following whichever site is on top.
const INTRO = 0.16;

export function HeroStage() {
  const stageRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const cards = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-deck-card]"),
    );
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.style.setProperty("--p", "1");
      return;
    }

    const n = cards.length;
    let raf = 0;
    let shown = 0;
    const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

    const update = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      // The last tenth of the pinned distance holds the final card still.
      const raw = clamp(-rect.top / ((rect.height - window.innerHeight) * 0.9));
      stage.style.setProperty("--p", String(clamp(raw / INTRO)));
      const q = clamp((raw - INTRO) / (1 - INTRO)) * (n - 1);
      cards.forEach((card, i) => {
        // enter: 0 below the frame, 1 in place. cover: how far the next card has landed on it.
        const enter = i === 0 ? 1 : clamp(q - (i - 1));
        const cover = clamp(q - i);
        card.style.setProperty("--enter", enter.toFixed(4));
        card.style.setProperty("--cover", cover.toFixed(4));
      });
      stage.style.setProperty("--q", (q / (n - 1)).toFixed(4));
      const top = Math.min(n - 1, Math.floor(q + 0.5));
      if (top !== shown) {
        shown = top;
        setActive(top);
      }
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

  const current = PROJECTS[active];
  const pad = (i: number) => String(i).padStart(2, "0");

  return (
    <section
      ref={stageRef}
      className="stage"
      aria-label="Featured work"
      style={{ "--count": PROJECTS.length } as React.CSSProperties}
    >
      <div className="stage-sticky">
        <div className="stage-plate">
          <div className="stage-frame stage-back stage-back--left">
            <ProjectShot name="hp-cutz" alt="" />
          </div>
          <div className="stage-frame stage-back stage-back--right">
            <ProjectShot name="ayrah-logistics" alt="" />
          </div>
          <div className="stage-deck">
            {PROJECTS.map((project, i) => (
              <div
                key={project.slug}
                data-deck-card
                className="stage-frame stage-card"
                style={{ zIndex: 2 + i }}
                aria-hidden={i !== active}
              >
                <ProjectShot
                  name={project.slug}
                  alt={`${project.name} website homepage`}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="stage-caption">
          <div className="stage-progress" aria-hidden="true">
            <span />
          </div>
          <a
            key={current.slug}
            href={current.href}
            target="_blank"
            rel="noopener noreferrer"
            className="stage-caption-link rise flex items-baseline justify-between gap-6"
          >
            <span className="flex min-w-0 items-baseline gap-4">
              <span className="t-mono shrink-0 text-graphite">
                {pad(active + 1)} / {pad(PROJECTS.length)}
              </span>
              <span className="t-ui truncate text-chalk">{current.name}</span>
              <span className="stage-summary t-lead hidden truncate md:inline">
                {current.summary}
              </span>
            </span>
            <span className="t-mono shrink-0 text-graphite"><span className="hidden sm:inline">See the site </span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
