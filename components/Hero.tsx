import Image from "next/image";
import Container from "./Container";
import Nav from "./Nav";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink">
      <Nav />

      <div className="relative min-h-[92vh] w-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/hero-web.mp4"
          poster="/images/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        {/* Legibility scrim: darker on the left where the headline sits */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(11,32,20,0.88) 0%, rgba(11,32,20,0.62) 34%, rgba(11,32,20,0.18) 58%, rgba(11,32,20,0.35) 100%)",
          }}
          aria-hidden="true"
        />

        <Container className="relative z-10 flex min-h-[92vh] items-center pt-28 pb-20">
          <div className="grid w-full items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-xl">
              <p className="font-display text-sm font-semibold text-lemon">
                Aqua Spark — dish wash, made with real lemon
              </p>
              <h1 className="mt-4 font-display text-[2.75rem] leading-[1.05] font-semibold text-white sm:text-6xl">
                Grease meets its match in a single drop of citrus.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">
                Aqua Spark cuts through oil and burnt-on food on contact, then
                rinses away clean — no soaking, no film, just the smell of
                fresh lemon left on the sink.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#how"
                  className="rounded-full bg-lemon px-7 py-3.5 font-semibold text-ink shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
                >
                  See how it works
                </a>
                <a
                  href="#buy"
                  className="rounded-full border border-white/35 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Where to buy
                </a>
              </div>
            </div>

            <div className="relative hidden justify-self-end md:block">
              <div
                className="absolute -inset-10 rounded-full opacity-70 blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(255,200,48,0.35), transparent 70%)",
                }}
                aria-hidden="true"
              />
              {/* <Image
                src="/images/bottle-photo.jpeg"
                alt="Aqua Spark 250ml lemon dish wash bottle"
                width={420}
                height={706}
                priority
                className="relative h-[64vh] max-h-[560px] w-auto rounded-[2rem] object-cover shadow-2xl shadow-black/40 ring-1 ring-white/15"
              /> */}
            </div>
          </div>
        </Container>

        {/* Trust strip anchored to the bottom edge of the hero */}
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-ink/55 backdrop-blur-sm">
          <Container className="grid grid-cols-2 divide-x divide-white/15 py-5 text-white sm:grid-cols-4">
            {[
              ["250ml", "concentrated bottle"],
              ["Real lemon", "not just fragrance"],
              ["1 drop", "cuts grease fast"],
              ["Gentle", "on hands, tough on oil"],
            ].map(([stat, label]) => (
              <div key={stat} className="px-4 text-center first:pl-0 last:pr-0 sm:text-left">
                <p className="font-display text-lg font-semibold sm:text-xl">
                  {stat}
                </p>
                <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
                  {label}
                </p>
              </div>
            ))}
          </Container>
        </div>
      </div>
    </section>
  );
}
