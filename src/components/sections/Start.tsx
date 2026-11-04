import { Reveal } from "@/components/Reveal";

const WHATSAPP_HREF =
  "https://wa.me/447496084292?text=Hi%2C%20I%27d%20like%20to%20talk%20about%20a%20custom%20software%20project";

const OFFERS = [
  {
    name: "Website",
    price: "£200",
    body: "Three or more pages with booking or quote built in. Fixed price.",
    ground: "ground-light",
    button: "btn-solid",
  },
  {
    name: "Custom software",
    price: "Quoted",
    body: "Bespoke apps and internal tools. Tell us what you need, we'll quote it.",
    ground: "bg-surface",
    button: "btn-line",
  },
];

export function Start() {
  return (
    <section id="pricing" className="px-6 pb-28 pt-28 md:px-10 md:pb-40 md:pt-40">
      <Reveal className="mx-auto max-w-wide">
        <h2 data-reveal className="t-display t-d2">
          Two ways to start a project.
        </h2>
        <ul className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-2">
          {OFFERS.map((offer) => (
            <li
              key={offer.name}
              data-reveal
              className={`${offer.ground} flex min-h-[26rem] flex-col rounded-xl p-8 md:min-h-[32rem] md:p-10`}
            >
              <h3 className="t-ui text-xl text-chalk">{offer.name}</h3>
              <p className="t-display t-d1 mt-4">{offer.price}</p>
              <p className="t-lead mt-auto max-w-md pt-10">{offer.body}</p>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ${offer.button} mt-8 self-start`}
              >
                Message on WhatsApp
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
