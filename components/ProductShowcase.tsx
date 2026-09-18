import Image from "next/image";
import Container from "./Container";

const callouts = [
  {
    n: "1",
    top: "9%",
    left: "52%",
    title: "Easy-pour spout",
    body: "A narrow cap opening so you control the drop instead of guessing the pour.",
  },
  {
    n: "2",
    top: "34%",
    left: "34%",
    title: "Concentrated formula",
    body: "The liquid is built strong on purpose — a few drops do what a capful of a thinner wash can't.",
  },
  {
    n: "3",
    top: "63%",
    left: "55%",
    title: "Real lemon extract",
    body: "The citrus cut-through comes from actual lemon, not a fragrance sprayed on top.",
  },
  {
    n: "4",
    top: "88%",
    left: "32%",
    title: "Grip-friendly body",
    body: "Shaped to hold steady in a wet, soapy hand at the sink.",
  },
];

export default function ProductShowcase() {
  return (
    <section id="why" className="bg-cream py-24 sm:py-32">
      <Container>
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div className="relative mx-auto w-full max-w-sm">
            <div
              className="absolute -inset-8 -z-10 rounded-[3rem] opacity-60 blur-2xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(111,166,15,0.25), transparent 72%)",
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <Image
                src="/images/bottle-photo.jpeg"
                alt="Aqua Spark bottle showing the label, cap, and citrus-yellow formula"
                width={520}
                height={876}
                className="w-full rounded-[2rem] shadow-xl shadow-lime-deep/10"
              />
              {callouts.map((c) => (
                <span
                  key={c.n}
                  className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lemon font-display text-sm font-bold text-ink ring-4 ring-cream"
                  style={{ top: c.top, left: c.left }}
                >
                  {c.n}
                </span>
              ))}
            </div>
          </div>

          <div className="max-w-lg">
            <p className="font-display text-sm font-semibold text-lime-deep">
              Why it works
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-[2.75rem]">
              Every part of the bottle is doing something.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              Aqua Spark isn&apos;t a scented rebottle of a generic wash. From
              the spout to the formula, it&apos;s built around one job:
              breaking down grease fast, without wrecking your hands.
            </p>

            <dl className="mt-10 space-y-7">
              {callouts.map((c) => (
                <div key={c.n} className="flex gap-4">
                  <dt className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime/15 font-display text-sm font-bold text-lime-deep">
                    {c.n}
                  </dt>
                  <dd>
                    <p className="font-display font-semibold text-ink">
                      {c.title}
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink/65">
                      {c.body}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
