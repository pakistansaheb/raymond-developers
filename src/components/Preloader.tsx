"use client";

import { useEffect, useState } from "react";

import { Wordmark } from "@/components/Wordmark";

const COUNT_MS = 1600;
const HOLD_MS = 200;
const EXIT_MS = 700;

/**
 * A percentage counter that wipes away into the real page on every load —
 * not tied to actual asset/network timing, since this site is small enough
 * that real load completes near-instantly, which would make a "real"
 * progress bar jump straight to 100 and defeat the point. Skipped entirely
 * under prefers-reduced-motion.
 */
export function Preloader() {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setPhase("done");
      return;
    }

    document.body.style.overflow = "hidden";

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setPercent(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setPhase("exiting"), HOLD_MS);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== "exiting") return;
    const timeout = window.setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-void transition-transform ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        phase === "exiting" ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{ transitionDuration: `${EXIT_MS}ms` }}
    >
      <Wordmark className="text-2xl md:text-3xl" />
      {/* Deliberately not .t-mono here — that class fixes font-size to
          0.6875rem for registry-code use, which an unlayered custom rule
          would win over a Tailwind text-size utility under Tailwind v4's
          cascade layers. `font-mono` (Tailwind-generated from the
          `--font-mono` theme token) avoids that fight entirely. */}
      <span className="font-mono text-6xl font-medium text-chalk md:text-8xl">
        {percent}%
      </span>
      <div className="h-px w-40 bg-hairline md:w-56">
        <div
          className="h-full bg-signal transition-[width] duration-100"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
