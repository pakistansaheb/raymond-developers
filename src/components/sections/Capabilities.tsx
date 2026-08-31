import { BlurRevealText } from "@/components/BlurRevealText";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

function words(text: string) {
  const parts = text.split(" ");
  return parts.flatMap((word, i) => {
    const span = (
      <span key={`${word}-${i}`} data-blur-reveal className="text-chalk">
        {word}
      </span>
    );
    return i < parts.length - 1 ? [span, " "] : [span];
  });
}

export function Capabilities() {
  return (
    <section id="02" className="bleed-rule px-6 py-24 md:px-10 md:py-32 xl:pl-28">
      <div className="mx-auto max-w-measure">
        <Reveal className="flex flex-col gap-10">
          <div data-reveal>
            <Eyebrow label="CAPABILITY" code="02" descriptor="SCOPE" />
          </div>

          <BlurRevealText className="t-ui max-w-4xl text-3xl leading-snug sm:text-4xl md:text-5xl">
            {words("What we build is real software")}{" "}
            {words(
              "— websites, web applications, internal tools and booking systems,",
            )}{" "}
            <span
              data-blur-reveal
              className="mx-1 inline-flex h-7 w-7 translate-y-1 items-center justify-center rounded-md bg-chalk align-middle font-mono text-[11px] font-bold text-void sm:h-8 sm:w-8"
            >
              RD
            </span>{" "}
            {words("built around how your business actually runs,")}{" "}
            {words("not squeezed into a template.")}
          </BlurRevealText>
        </Reveal>
      </div>
    </section>
  );
}
