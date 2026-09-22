import "server-only";

import { connection } from "next/server";
import fallback from "@/data/site-content.json";
import { getDatabase } from "@/lib/mongodb";

export type NavigationLink = (typeof fallback.navigationLinks)[number];
export type FeatureRow = (typeof fallback.featureRows)[number];
export type UsageStep = (typeof fallback.usageSteps)[number];
export type Product = (typeof fallback.products)[number];
export type ProductCallout = (typeof fallback.productCallouts)[number];
export type SiteSettings = (typeof fallback.siteSettings)[number];
export type TickerDeal = (typeof fallback.tickerDeals)[number];

async function getCollection<T extends { id: string; order?: number }>(
  collection: string,
  fallbackRecords: readonly T[],
): Promise<T[]> {
  await connection();

  try {
    const database = await getDatabase();
    const records = await database
      .collection<T>(collection)
      .find({})
      .sort({ order: 1 })
      .toArray();

    return records.length > 0 ? (records as unknown as T[]) : [...fallbackRecords];
  } catch (error) {
    console.error(`Unable to read ${collection} from MongoDB; using fallback content.`, error);
    return [...fallbackRecords];
  }
}

export const getNavigationLinks = () =>
  getCollection<NavigationLink>("navigationLinks", fallback.navigationLinks);

export const getFeatureRows = () =>
  getCollection<FeatureRow>("featureRows", fallback.featureRows);

export const getUsageSteps = () =>
  getCollection<UsageStep>("usageSteps", fallback.usageSteps);

export const getProducts = () => getCollection<Product>("products", fallback.products);

export const getProductCallouts = () =>
  getCollection<ProductCallout>("productCallouts", fallback.productCallouts);

export const getTickerDeals = () =>
  getCollection<TickerDeal>("tickerDeals", fallback.tickerDeals);

export async function getSiteSettings() {
  const records = await getCollection<SiteSettings>("siteSettings", fallback.siteSettings);
  const defaults = fallback.siteSettings[0];
  return records.map((record) => ({
    ...defaults,
    ...record,
    hero: { ...defaults.hero, ...record.hero },
    productSection: { ...defaults.productSection, ...record.productSection },
    howToUse: { ...defaults.howToUse, ...record.howToUse },
    whereToBuy: { ...defaults.whereToBuy, ...record.whereToBuy },
    footer: { ...defaults.footer, ...record.footer },
    navigation: { ...defaults.navigation, ...record.navigation },
  })) as SiteSettings[];
}

export async function getSiteContent() {
  const [navigationLinks, featureRows, usageSteps, products, productCallouts, siteSettings, tickerDeals] =
    await Promise.all([
      getNavigationLinks(),
      getFeatureRows(),
      getUsageSteps(),
      getProducts(),
      getProductCallouts(),
      getSiteSettings(),
      getTickerDeals(),
    ]);

  return { navigationLinks, featureRows, usageSteps, products, productCallouts, siteSettings, tickerDeals };
}
