import { getFile } from "@/lib/file-store";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  if (!filename) {
    return Response.json({ error: "Missing filename." }, { status: 400 });
  }

  // Filenames are `<uuid>.<ext>`; the uuid is the MongoDB document id.
  const id = filename.split(".")[0];
  const extension = filename.slice(id.length).toLowerCase();

  try {
    const file = await getFile(id);
    if (!file) {
      return Response.json({ error: "File not found." }, { status: 404 });
    }

    return new Response(new Uint8Array(file.data), {
      headers: {
        "Content-Type": contentTypes[extension] ?? file.contentType ?? "application/octet-stream",
        // UUID-based names are unique forever, so an immutable public cache is safe.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Unable to serve upload", error);
    return Response.json({ error: "Upload could not be served." }, { status: 500 });
  }
}