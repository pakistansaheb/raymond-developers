import { Reveal } from "@/components/Reveal";

const ITEMS = [
  {
    q: "What does hosting include?",
    a: "Your site stays live, fast, with SSL and your domain connected. £20 covers hosting only. Content edits, SEO and support are quoted separately.",
  },
  {
    q: "What happens if I cancel?",
    a: "Email us. Hosting stops, with no notice period and no fee. Paid in advance, so it runs until the last invoiced period ends.",
  },
  {
    q: "Do I own my site and code?",
    a: "Yes. Cancelling hosting only affects who keeps it live, not who owns it.",
  },
  {
    q: "How long does a build take?",
    a: "Depends on scope. You get a specific timeline in the proposal before committing.",
  },
  {
    q: "How do I pay?",
    a: "Direct bank transfer, against an invoice, for the site, hosting, or custom software. No card details collected.",
  },
  {
    q: "Can I ask you to make changes after launch?",
    a: "Yes. Get in touch and we'll quote it, separate from hosting.",
  },
  {
    q: "What's the difference between the £200 website and custom software?",
    a: "£200 buys a fixed package: three-plus pages with booking or quote built in. Custom software is bespoke, scoped and priced after a conversation.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="px-6 pb-20 pt-20 md:px-10 md:pb-40 md:pt-40">
      <Reveal className="mx-auto grid max-w-wide gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
        <h2 data-reveal className="t-display t-d2 self-start lg:sticky lg:top-28">
          Questions, answered plainly.
        </h2>
        <div data-reveal>
          {ITEMS.map((item) => (
            <details key={item.q} className="group border-t border-hairline last:border-b">
              <summary className="flex min-h-11 items-center justify-between gap-6 py-6">
                <span className="t-ui text-lg text-chalk md:text-xl">{item.q}</span>
                <span
                  aria-hidden="true"
                  className="fq-sign shrink-0 text-2xl font-light leading-none text-graphite group-hover:text-signal"
                >
                  +
                </span>
              </summary>
              <p className="t-lead max-w-2xl pb-7">{item.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
