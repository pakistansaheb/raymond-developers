"use client";

import { useEffect, useRef } from "react";

import { ProjectShot } from "@/components/ProjectShot";

export function HeroStage() {
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.style.setProperty("--p", "1");
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      // The last fifth of the pinned distance holds the settled frame.
      const raw = -rect.top / ((rect.height - window.innerHeight) * 0.8);
      stage.style.setProperty("--p", String(Math.min(Math.max(raw, 0), 1)));
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
    <section ref={stageRef} className="stage" aria-label="Featured work">
      <div className="stage-sticky">
        <div className="stage-plate">
          <div className="stage-frame stage-back stage-back--left">
            <ProjectShot name="hp-cutz" alt="" />
          </div>
          <div className="stage-frame stage-back stage-back--right">
            <ProjectShot name="ayrah-logistics" alt="" />
          </div>
          <div className="stage-frame stage-main">
            <ProjectShot
              name="raymond-logistics"
              alt="Raymond Logistics website homepage"
              priority
            />
          </div>
        </div>
        <a
          href="https://raymondlogistics.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="stage-caption flex items-baseline justify-between gap-6"
        >
          <span className="t-ui text-chalk">Raymond Logistics</span>
          <span className="t-mono text-graphite">See the site →</span>
        </a>
      </div>
    </section>
  );
}
