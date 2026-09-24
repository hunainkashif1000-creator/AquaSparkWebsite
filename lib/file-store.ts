import "server-only";

import { Binary } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

/**
 * MongoDB-backed file store ("mini GridFS").
 *
 * Vercel's filesystem is read-only and ephemeral, so runtime uploads cannot be
 * written to `public/` on the deployed site. Instead we persist files inside
 * MongoDB Atlas (the same cloud database the site already uses), split into
 * chunks so files larger than the 16 MB BSON document limit (e.g. hero videos)
 * are supported. Serving is done by `app/api/uploads/[filename]/route.ts`,
 * which streams the stored bytes back with the correct content type.
 *
 * This works identically in local development and on Vercel, because both use
 * the same MONGODB_URI/MONGODB_DB connection.
 */

// Chunk size: keeps every chunk document small and far below the 16 MB BSON cap.
const CHUNK_SIZE = 1024 * 1024;
const FILES_COLLECTION = "mediaFiles";
const CHUNKS_COLLECTION = "mediaChunks";

export type StoredFile = {
  id: string;
  name: string;
  contentType: string;
  size: number;
  data: Buffer;
};

type MediaFileDoc = {
  _id: string;
  name: string;
  contentType: string;
  size: number;
  chunkCount: number;
  uploadedAt: Date;
};

type MediaChunkDoc = {
  fileId: string;
  n: number;
  data: Binary;
};

export function isStoredUrl(value: string): boolean {
  return value?.startsWith("/api/uploads/") === true;
}

export function fileIdFromUrl(url: string): string | null {
  if (!isStoredUrl(url)) return null;
  const filename = url.slice("/api/uploads/".length);
  return filename.split(".")[0] || null;
}

export function buildFileUrl(id: string, extension: string): string {
  return `/api/uploads/${id}${extension}`;
}

export async function saveFile(input: {
  name: string;
  contentType: string;
  data: Buffer;
}): Promise<StoredFile> {
  const database = await getDatabase();
  const files = database.collection<MediaFileDoc>(FILES_COLLECTION);
  const chunks = database.collection<MediaChunkDoc>(CHUNKS_COLLECTION);

  const id = crypto.randomUUID();

  const chunkDocuments: MediaChunkDoc[] = [];
  let offset = 0;
  let n = 0;
  while (offset < input.data.length) {
    const part = input.data.subarray(offset, Math.min(offset + CHUNK_SIZE, input.data.length));
    chunkDocuments.push({ fileId: id, n, data: new Binary(Buffer.from(part)) });
    offset += CHUNK_SIZE;
    n += 1;
  }

  try {
    await files.insertOne({
      _id: id,
      name: input.name,
      contentType: input.contentType,
      size: input.data.length,
      chunkCount: chunkDocuments.length,
      uploadedAt: new Date(),
    });
    if (chunkDocuments.length > 0) {
      await chunks.insertMany(chunkDocuments, { ordered: true });
    }
  } catch (error) {
    // Roll back partial writes so we never leave orphaned chunks behind.
    await chunks.deleteMany({ fileId: id }).catch(() => {});
    await files.deleteOne({ _id: id }).catch(() => {});
    throw error;
  }

  return {
    id,
    name: input.name,
    contentType: input.contentType,
    size: input.data.length,
    data: input.data,
  };
}

export async function getFile(id: string): Promise<StoredFile | null> {
  const database = await getDatabase();
  const files = database.collection<MediaFileDoc>(FILES_COLLECTION);
  const chunks = database.collection<MediaChunkDoc>(CHUNKS_COLLECTION);

  const meta = await files.findOne({ _id: id });
  if (!meta) return null;

  const records = await chunks.find({ fileId: id }).sort({ n: 1 }).toArray();
  const parts = records.map((record) => Buffer.from(record.data.buffer));

  return {
    id,
    name: meta.name,
    contentType: meta.contentType,
    size: meta.size,
    data: Buffer.concat(parts),
  };
}

export async function deleteFile(id: string): Promise<void> {
  const database = await getDatabase();
  await database.collection<MediaChunkDoc>(CHUNKS_COLLECTION).deleteMany({ fileId: id });
  await database.collection<MediaFileDoc>(FILES_COLLECTION).deleteOne({ _id: id });
}