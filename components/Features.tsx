import Container from "./Container";
import { DropIcon, GreaseIcon, HandIcon } from "./icons";
import { getFeatureRows } from "@/lib/site-content";

const icons = { grease: GreaseIcon, drop: DropIcon, hand: HandIcon };

export default async function Features() {
  const rows = await getFeatureRows();
  return <section className="bg-cream pb-28"><Container><div className="space-y-20">{rows.map((row, index) => {
    const Icon = icons[row.icon as keyof typeof icons] ?? DropIcon;
    const reversed = index % 2 === 1;
    return <div key={row.id} className={`grid items-center gap-10 md:grid-cols-2 ${reversed ? "md:[&>*:first-child]:order-2" : ""}`}><div className={`flex justify-center ${reversed ? "md:justify-end" : "md:justify-start"}`}><div className={`flex h-40 w-40 items-center justify-center rounded-[2.5rem] sm:h-48 sm:w-48 ${row.tint}`}><Icon /></div></div><div className={reversed ? "md:pr-6" : "md:pl-6"}><p className="font-display text-sm font-semibold text-lime-deep">{row.eyebrow}</p><h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">{row.title}</h3><p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink/70">{row.body}</p></div></div>;
  })}</div></Container></section>;
}
