  import nextEnv from "@next/env";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";

const projectDirectory = process.cwd();
const dataDirectory = path.join(projectDirectory, "data");

const { loadEnvConfig } = nextEnv;

loadEnvConfig(projectDirectory);

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB ?? "aqua-spark";

async function findJsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const filePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return findJsonFiles(filePath);
      }

      return entry.isFile() && entry.name.endsWith(".json") ? [filePath] : [];
    }),
  );

  return files.flat();
}

function collectionNameFor(filePath) {
  return path.basename(filePath, ".json");
}

function recordsFromJson(value, filePath) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    return [value];
  }

  throw new Error(`${path.relative(projectDirectory, filePath)} must contain an object or array.`);
}

function migrationKey(record, index, filePath) {
  if (record && typeof record === "object" && !Array.isArray(record)) {
    if (record._id !== undefined) return { _id: record._id };
    if (record.id !== undefined) return { id: record.id };
  }

  throw new Error(
    `${path.relative(projectDirectory, filePath)} record ${index + 1} has no _id or id. Add a stable ID before migrating.`,
  );
}

async function migrateFile(database, filePath) {
  const raw = await readFile(filePath, "utf8");
  const value = JSON.parse(raw);
  const collections =
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value).every((records) => Array.isArray(records))
      ? Object.entries(value)
      : [[collectionNameFor(filePath), recordsFromJson(value, filePath)]];

  const results = [];

  for (const [collectionName, records] of collections) {
    const result = await migrateRecords(database, collectionName, records, filePath);
    results.push(result);
  }

  return results;
}

async function migrateRecords(database, collectionName, records, filePath) {
  const collection = database.collection(collectionName);
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const [index, record] of records.entries()) {
    const filter = migrationKey(record, index, filePath);
    const existing = await collection.findOne(filter, { projection: { _id: 1 } });

    if (existing) {
      await collection.replaceOne(filter, record);
      updated += 1;
    } else {
      await collection.insertOne(record);
      inserted += 1;
    }
  }

  return { collection: collection.collectionName, inserted, updated, skipped };
}

async function main() {
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Add it to .env.local before running npm run migrate.");
  }

  console.log(`Connecting to MongoDB database "${databaseName}"...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    await client.db(databaseName).command({ ping: 1 });
    console.log("MongoDB connection verified.");

    if (!existsSync(dataDirectory)) {
      console.log("No data/ directory found; no application JSON files to migrate.");
      return;
    }

    const files = await findJsonFiles(dataDirectory);
    if (files.length === 0) {
      console.log("No JSON data files found in data/; nothing to migrate.");
      return;
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const filePath of files) {
      const results = await migrateFile(client.db(databaseName), filePath);
      for (const result of results) {
        inserted += result.inserted;
        updated += result.updated;
        skipped += result.skipped;
        console.log(
          `${result.collection}: inserted ${result.inserted}, updated ${result.updated}, skipped ${result.skipped}`,
        );
      }
    }

    console.log(`Migration complete: inserted ${inserted}, updated ${updated}, skipped ${skipped}.`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
