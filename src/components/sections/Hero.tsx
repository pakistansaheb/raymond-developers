import Link from "next/link";

import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { HeroGlow } from "@/components/sections/HeroGlow";
import { HeroScene } from "@/components/sections/HeroScene";

export function Hero() {
  return (
    <section id="01" className="relative px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-20 xl:pl-28">
      <HeroGlow />
      <div className="relative z-10 mx-auto max-w-measure">
        <Reveal className="flex flex-col gap-10">
          <div data-reveal className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow label="STUDIO" code="01" descriptor="INTRO" />
            <span className="t-mono inline-flex items-center gap-2 border border-hairline px-3 py-1.5 text-chalk">
              <span
                aria-hidden="true"
                className="live-square h-[6px] w-[6px] bg-signal"
              />
              Available for new work
            </span>
          </div>

          <h1 data-reveal className="t-display t-d1 max-w-4xl">
            We design.
            <br />
            We build.
            <br />
            We make it
            <br />
            real.
          </h1>

          <div data-reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="t-lead max-w-xl">
              Websites and bespoke software, designed and built in
              Birmingham for clients across the UK.
            </p>
            <div className="flex shrink-0 gap-3">
              <Link
                href="#05"
                className="t-mono border border-signal bg-signal px-5 py-3.5 text-void transition-opacity hover:opacity-85"
              >
                Start a project
              </Link>
              <a
                href="mailto:abdulrahmanammad7@gmail.com"
                className="t-mono border border-hairline px-5 py-3.5 text-chalk transition-colors hover:border-signal hover:text-signal"
              >
                Get in touch
              </a>
            </div>
          </div>

          <div data-reveal>
            <HeroScene />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
