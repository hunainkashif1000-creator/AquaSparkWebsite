import Container from "./Container";
import { DropIcon, GreaseIcon, HandIcon } from "./icons";

const rows = [
  {
    icon: GreaseIcon,
    tint: "bg-lemon/25 text-lemon-deep",
    eyebrow: "On contact",
    title: "Grease lets go faster than you expect.",
    body: "Burnt-on food and cold oil are the two things most washes struggle with. Aqua Spark's formula breaks the bond between grease and steel almost as soon as it touches — pans that usually sit soaking wipe clean the first pass.",
  },
  {
    icon: DropIcon,
    tint: "bg-aqua/20 text-aqua-deep",
    eyebrow: "Concentrated",
    title: "A little drop covers a full sink.",
    body: "Because the formula isn't watered down, you use less per wash than you're used to. A 250ml bottle of Aqua Spark quietly outlasts a bigger bottle of something thinner.",
  },
  {
    icon: HandIcon,
    tint: "bg-lime/20 text-lime-deep",
    eyebrow: "Everyday use",
    title: "Tough on oil, easy on your hands.",
    body: "No harsh degreasers doing the heavy lifting — just a citrus-based formula that can be part of your daily wash without leaving hands dry and tight afterward.",
  },
];

export default function Features() {
  return (
    <section className="bg-cream pb-28">
      <Container>
        <div className="space-y-20">
          {rows.map((row, i) => {
            const Icon = row.icon;
            const reversed = i % 2 === 1;
            return (
              <div
                key={row.title}
                className={`grid items-center gap-10 md:grid-cols-2 ${
                  reversed ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className={`flex justify-center ${reversed ? "md:justify-end" : "md:justify-start"}`}>
                  <div
                    className={`flex h-40 w-40 items-center justify-center rounded-[2.5rem] sm:h-48 sm:w-48 ${row.tint}`}
                  >
                    <Icon />
                  </div>
                </div>
                <div className={reversed ? "md:pr-6" : "md:pl-6"}>
                  <p className="font-display text-sm font-semibold text-lime-deep">
                    {row.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {row.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink/70">
                    {row.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
