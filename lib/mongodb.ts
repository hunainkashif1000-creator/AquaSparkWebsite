import "server-only";

import { Db, MongoClient } from "mongodb";

const databaseName = process.env.MONGODB_DB ?? "aqua-spark";

type MongoCache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
};

declare global {
  var mongoCache: MongoCache | undefined;
}

const cache = global.mongoCache ?? { client: null, promise: null };

if (process.env.NODE_ENV !== "production") {
  global.mongoCache = cache;
}

export async function getDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!cache.client) {
    cache.promise ??= new MongoClient(uri).connect();

    try {
      cache.client = await cache.promise;
    } catch (error) {
      cache.promise = null;
      throw error;
    }
  }

  return cache.client.db(databaseName);
}
