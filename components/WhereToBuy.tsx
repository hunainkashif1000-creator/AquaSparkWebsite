import Container from "./Container";
import InquiryForm from "./InquiryForm";
import { getSiteSettings } from "@/lib/site-content";

export default async function WhereToBuy() {
  const content = (await getSiteSettings())[0].whereToBuy;
  return <section id="buy" className="bg-aqua-deep pb-28 text-white"><Container><div className="grid gap-14 md:grid-cols-2 md:gap-20"><div><p className="font-display text-sm font-semibold text-lemon">{content.eyebrow}</p><h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-[2.75rem]">{content.title}</h2><p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">{content.body}</p><dl className="mt-10 grid gap-6 sm:grid-cols-2">{content.details.map(([label, value]) => <div key={label}><dt className="font-display font-semibold">{label}</dt><dd className="mt-1 text-white/70">{value}</dd></div>)}</dl></div><InquiryForm /></div></Container></section>;
}
