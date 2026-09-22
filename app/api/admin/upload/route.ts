import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

const acceptedTypes = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "video/mp4", "video/webm",
]);
const extensions: Record<string, string> = {
  "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif", "video/mp4": ".mp4", "video/webm": ".webm",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Choose a file first." }, { status: 400 });
    if (!acceptedTypes.has(file.type)) return Response.json({ error: "Use a JPG, PNG, WebP, GIF, AVIF, MP4, or WebM file." }, { status: 400 });
    if (file.size > 25 * 1024 * 1024) return Response.json({ error: "Files must be 25 MB or smaller." }, { status: 413 });

    const directory = path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    const filename = `${randomUUID()}${extensions[file.type]}`;
    await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
    revalidatePath("/", "layout");
    return Response.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Unable to upload media", error);
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
