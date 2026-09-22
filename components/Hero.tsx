import Container from "./Container";
import Nav from "./Nav";
import { getSiteSettings } from "@/lib/site-content";

export default async function Hero() {
  const settings = (await getSiteSettings())[0];
  return <section id="top" className="relative overflow-hidden bg-ink">
    <Nav />
    <div className="relative min-h-[92vh] w-full">
      <video className="absolute inset-0 h-full w-full object-cover" src={settings.hero.video} poster={settings.hero.poster} autoPlay muted loop playsInline aria-hidden="true" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(11,32,20,0.88) 0%, rgba(11,32,20,0.62) 34%, rgba(11,32,20,0.18) 58%, rgba(11,32,20,0.35) 100%)" }} aria-hidden="true" />
      <Container className="relative z-10 flex min-h-[92vh] items-center pt-28 pb-20"><div className="grid w-full items-center gap-12 md:grid-cols-[1.1fr_0.9fr]"><div className="max-w-xl">
        <p className="font-display text-sm font-semibold text-lemon">{settings.hero.eyebrow}</p>
        <h1 className="mt-4 font-display text-[2.75rem] leading-[1.05] font-semibold text-white sm:text-6xl">{settings.hero.title}</h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">{settings.hero.body}</p>
        <div className="mt-9 flex flex-wrap items-center gap-4"><a href="#how" className="rounded-full bg-lemon px-7 py-3.5 font-semibold text-ink shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5">{settings.hero.primaryCta}</a><a href="#buy" className="rounded-full border border-white/35 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10">{settings.hero.secondaryCta}</a></div>
      </div></div></Container>
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-ink/55 backdrop-blur-sm"><Container className="grid grid-cols-2 divide-x divide-white/15 py-5 text-white sm:grid-cols-4">{settings.hero.trustItems.map(([stat, label]) => <div key={stat} className="px-4 text-center first:pl-0 last:pr-0 sm:text-left"><p className="font-display text-lg font-semibold sm:text-xl">{stat}</p><p className="mt-0.5 text-xs text-white/70 sm:text-sm">{label}</p></div>)}</Container></div>
    </div>
  </section>;
}
