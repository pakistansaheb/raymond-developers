import { Reveal } from "@/components/Reveal";

export function Contact() {
  return (
    <section id="contact" className="ground-light px-6 py-24 md:px-10 md:py-48">
      <Reveal className="mx-auto flex max-w-wide flex-col gap-10">
        <h2 data-reveal className="t-display t-d1 max-w-5xl">
          Tell us what you&apos;re trying to build.
        </h2>
        <p data-reveal className="t-lead max-w-xl">
          Email a rough idea, a link to something you like, or a problem you
          haven&apos;t solved yet. We&apos;ll reply with questions.
        </p>
        <a
          data-reveal
          href="mailto:abdulrahmanammad7@gmail.com"
          className="t-display t-d3 inline-block self-start break-all py-2 underline decoration-graphite decoration-1 underline-offset-8 transition-colors duration-150 hover:decoration-signal"
        >
          abdulrahmanammad7@gmail.com
        </a>
      </Reveal>
    </section>
  );
}
