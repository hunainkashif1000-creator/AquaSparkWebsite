import { revalidatePath } from "next/cache";
import { getSiteContent } from "@/lib/site-content";
import { getDatabase } from "@/lib/mongodb";
import type { Document } from "mongodb";

export const runtime = "nodejs";

const collections = [
  "navigationLinks",
  "featureRows",
  "usageSteps",
  "products",
  "productCallouts",
  "tickerDeals",
  "siteSettings",
] as const;

type CollectionName = (typeof collections)[number];
type ContentPayload = Record<CollectionName, unknown[]>;

function isPayload(value: unknown): value is ContentPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return collections.every(
    (name) => Array.isArray(candidate[name]) && candidate[name].every((item) => item && typeof item === "object" && !Array.isArray(item)),
  );
}

export async function GET() {
  return Response.json(await getSiteContent());
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!isPayload(body)) {
    return Response.json({ error: "All content sections must contain arrays of objects." }, { status: 400 });
  }

  try {
    const database = await getDatabase();
    await Promise.all(
      collections.map(async (name) => {
        const records = body[name].map((item) => {
          const record = { ...(item as Record<string, unknown>) };
          delete record._id;
          return record as Document;
        });
        const collection = database.collection(name);
        await collection.deleteMany({});
        if (records.length) await collection.insertMany(records);
      }),
    );
    revalidatePath("/", "layout");
    return Response.json({ success: true });
  } catch (error) {
    console.error("Unable to save site content", error);
    return Response.json({ error: "Content could not be saved. Check the MongoDB connection." }, { status: 503 });
  }
}
