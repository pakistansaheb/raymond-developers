"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function HeroStage() {
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.style.setProperty("--p", "1");
      return;
    }

    const pinned = window.matchMedia("(min-width: 768px)");
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      // The last fifth of the pinned distance holds the settled frame.
      const raw = pinned.matches
        ? -rect.top / ((rect.height - vh) * 0.8)
        : (vh - rect.top) / (vh + rect.height);
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
    <section ref={stageRef} className="stage px-6 md:px-0" aria-label="Featured work">
      <div className="stage-sticky">
        <div className="stage-plate">
          <div className="stage-frame stage-back stage-back--left">
            <Image
              src="/images/work/hp-cutz.png"
              alt=""
              fill
              sizes="50vw"
              className="object-cover object-top"
            />
          </div>
          <div className="stage-frame stage-back stage-back--right">
            <Image
              src="/images/work/ayrah-logistics.png"
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 62vw"
              className="object-cover object-top"
            />
          </div>
          <div className="stage-frame stage-main">
            <Image
              src="/images/work/raymond-logistics.png"
              alt="Raymond Logistics website homepage"
              fill
              priority
              sizes="(min-width: 768px) 92vw, 86vw"
              className="object-cover object-top"
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
          <span className="t-mono text-graphite">raymondlogistics.co.uk →</span>
        </a>
      </div>
    </section>
  );
}
