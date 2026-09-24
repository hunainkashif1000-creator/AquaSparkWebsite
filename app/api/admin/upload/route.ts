import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { deleteFile, fileIdFromUrl, isStoredUrl, saveFile } from "@/lib/file-store";

export const runtime = "nodejs";

const acceptedTypes = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "video/mp4", "video/webm",
]);
const extensions: Record<string, string> = {
  "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif", "video/mp4": ".mp4", "video/webm": ".webm",
};

// Vercel's Node runtime rejects request bodies larger than ~4.5 MB before the
// handler is even called, so cap at 4 MB to fail with a clear message instead
// of an opaque platform error.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Choose a file first." }, { status: 400 });
    if (!acceptedTypes.has(file.type)) return Response.json({ error: "Use a JPG, PNG, WebP, GIF, AVIF, MP4, or WebM file." }, { status: 400 });
    if (file.size > MAX_UPLOAD_BYTES) return Response.json({ error: `Files must be 4 MB or smaller on Vercel (this one is ${Math.ceil(file.size / 1024 / 1024)} MB).` }, { status: 413 });

    // Optional "current" field: when a stored file is being replaced, remove it
    // from the database so orphaned uploads are not left behind.
    const current = formData.get("current");
    const replacedId = typeof current === "string" && isStoredUrl(current) ? fileIdFromUrl(current) : null;

    const stored = await saveFile({
      name: file.name || `upload-${randomUUID()}`,
      contentType: file.type,
      data: Buffer.from(await file.arrayBuffer()),
    });

    if (replacedId) {
      try {
        await deleteFile(replacedId);
      } catch (error) {
        console.error("Could not delete replaced upload", replacedId, error);
      }
    }

    revalidatePath("/", "layout");
    return Response.json(
      { success: true, url: `/api/uploads/${stored.id}${extensions[file.type]}` },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to upload media", error);
    return Response.json(
      { error: "Upload failed. Check the server logs for the exact error." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
