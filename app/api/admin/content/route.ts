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

const noStore = { "Cache-Control": "no-store" };

function isPayload(value: unknown): value is ContentPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return collections.every(
    (name) => Array.isArray(candidate[name]) && candidate[name].every((item) => item && typeof item === "object" && !Array.isArray(item)),
  );
}

export async function GET() {
  return Response.json(await getSiteContent(), { headers: noStore });
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400, headers: noStore });
  }

  if (!isPayload(body)) {
    return Response.json({ error: "All content sections must contain arrays of objects." }, { status: 400, headers: noStore });
  }

  const written: Record<string, { deleted: number; inserted: number }> = {};

  try {
    const database = await getDatabase();

    for (const name of collections) {
      const records = body[name].map((item) => {
        const record = { ...(item as Record<string, unknown>) };
        delete record._id;
        return record as Document;
      });
      const collection = database.collection(name);

      // Verify every step so we never report success for a partial save.
      const deletion = await collection.deleteMany({});
      const insertion = records.length > 0 ? await collection.insertMany(records, { ordered: true }) : null;
      written[name] = {
        deleted: deletion.deletedCount,
        inserted: insertion?.insertedCount ?? 0,
      };
    }

    revalidatePath("/", "layout");
    return Response.json({ success: true, written }, { headers: noStore });
  } catch (error) {
    console.error("Unable to save site content", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      {
        error: "Content could not be saved. Check the MongoDB connection, the MONGODB_URI/MONGODB_DB environment variables, and the Atlas Network Access allowlist (Vercel egress IPs must be allowed).",
        details: message,
      },
      { status: 503, headers: noStore },
    );
  }
}
