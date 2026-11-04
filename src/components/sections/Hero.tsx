import Link from "next/link";

import { HeroStage } from "@/components/sections/HeroStage";

export function Hero() {
  return (
    <>
      <section className="px-6 pb-12 pt-14 md:px-10 md:pb-6 md:pt-28">
        <div className="mx-auto flex max-w-wide flex-col gap-8 md:gap-12">
          <h1 className="t-display t-d1">
            <span className="rise block">Websites that win work.</span>
            <span
              className="rise block text-graphite"
              style={{ animationDelay: "90ms" }}
            >
              Software that runs it.
            </span>
          </h1>
          <div
            className="rise flex flex-col gap-7 md:flex-row md:items-end md:justify-between"
            style={{ animationDelay: "180ms" }}
          >
            <p className="t-lead max-w-xl">
              A Birmingham studio designing and building for businesses across
              the UK. Fixed scope, fixed price, and the code is yours.
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="#pricing" className="btn btn-solid">
                Start a project
              </Link>
              <Link href="#work" className="btn btn-line">
                See the work
              </Link>
            </div>
          </div>
        </div>
      </section>
      <HeroStage />
    </>
  );
}
