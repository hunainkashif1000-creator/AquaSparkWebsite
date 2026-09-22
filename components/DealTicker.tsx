import { getTickerDeals } from "@/lib/site-content";

export default async function DealTicker() {
  const deals = (await getTickerDeals()).filter((deal) => deal.active);

  if (deals.length === 0) return null;

  const items = [...deals, ...deals];
  return (
    <section aria-label="Latest offers" className="overflow-hidden bg-lemon py-3 text-ink">
      <div className="ticker-track flex w-max items-center gap-10 whitespace-nowrap font-display text-sm font-semibold sm:text-base">
        {items.map((deal, index) => (
          <span key={`${deal.id}-${index}`} className="flex items-center gap-10">
            <span>{deal.text}</span>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime-deep" />
          </span>
        ))}
      </div>
    </section>
  );
}
