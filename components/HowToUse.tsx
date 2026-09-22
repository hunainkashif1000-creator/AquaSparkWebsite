import Container from "./Container";
import WaveDivider from "./WaveDivider";
import { getSiteSettings, getUsageSteps } from "@/lib/site-content";

export default async function HowToUse() {
  const [steps, settings] = await Promise.all([getUsageSteps(), getSiteSettings()]);
  const content = settings[0].howToUse;
  return <section id="how" className="relative bg-aqua-deep pb-24 pt-6 text-white"><div className="rotate-180"><WaveDivider color="var(--cream)" /></div><Container className="pt-10"><div className="max-w-xl"><p className="font-display text-sm font-semibold text-lemon">{content.eyebrow}</p><h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-[2.75rem]">{content.title}</h2></div><div className="relative mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8"><div className="absolute left-0 right-0 top-6 hidden h-px bg-white/20 sm:block" aria-hidden="true" />{steps.map((step) => <div key={step.id} className="relative"><span className="font-display text-5xl font-semibold text-lemon/90">{step.n}</span><h3 className="mt-5 font-display text-xl font-semibold">{step.title}</h3><p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/70">{step.body}</p></div>)}</div></Container></section>;
}
