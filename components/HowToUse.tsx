import Container from "./Container";
import WaveDivider from "./WaveDivider";

const steps = [
  {
    n: "01",
    title: "Add a few drops",
    body: "Straight onto your sponge, or into a sink of warm water — a little goes further than you'd think.",
  },
  {
    n: "02",
    title: "Work it over the grease",
    body: "No pre-soak needed. The foam lifts oil and burnt-on food as you scrub.",
  },
  {
    n: "03",
    title: "Rinse and you're done",
    body: "Dishes come out squeaky clean, and the sink smells like fresh lemon, not chemicals.",
  },
];

export default function HowToUse() {
  return (
    <section id="how" className="relative bg-aqua-deep pb-24 pt-6 text-white">
      <div className="rotate-180">
        <WaveDivider color="var(--cream)" />
      </div>

      <Container className="pt-10">
        <div className="max-w-xl">
          <p className="font-display text-sm font-semibold text-lemon">
            How to use
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-[2.75rem]">
            Three steps, one clean sink.
          </h2>
        </div>

        <div className="relative mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
          <div
            className="absolute left-0 right-0 top-6 hidden h-px bg-white/20 sm:block"
            aria-hidden="true"
          />
          {steps.map((step) => (
            <div key={step.n} className="relative">
              <span className="font-display text-5xl font-semibold text-lemon/90">
                {step.n}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/70">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
