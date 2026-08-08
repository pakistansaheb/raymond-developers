import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

export function Contact() {
  return (
    <section id="07" className="bleed-rule px-6 py-24 md:px-10 md:py-32 xl:pl-28">
      <div className="mx-auto max-w-measure">
        <Reveal className="flex flex-col gap-8">
          <div data-reveal>
            <Eyebrow label="CONTACT" code="07" descriptor="REACH" />
          </div>
          <h2 data-reveal className="t-display t-d2 max-w-2xl">
            Tell us what
            <br />
            you're trying
            <br />
            to build.
          </h2>
          <p data-reveal className="t-lead max-w-xl text-graphite">
            Email a rough idea, a link to something you like, or a problem
            you haven't solved yet. We'll reply with questions.
          </p>
          <a
            data-reveal
            href="mailto:abdulrahmanammad7@gmail.com"
            className="t-display inline-block py-3 text-3xl underline decoration-hairline decoration-2 underline-offset-8 transition-colors hover:decoration-signal md:text-5xl"
          >
            abdulrahmanammad7@gmail.com
          </a>
        </Reveal>
      </div>
    </section>
  );
}
