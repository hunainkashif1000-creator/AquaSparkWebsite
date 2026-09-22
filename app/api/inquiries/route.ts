import { createInquiry } from "@/lib/inquiries";

export const runtime = "nodejs";

const MAX_FIELD_LENGTH = 500;

function readText(value: unknown, required = false) {
  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();
  if ((required && !text) || text.length > MAX_FIELD_LENGTH) {
    return null;
  }

  return text;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, city, phone, message } = body as Record<string, unknown>;
  const inquiryName = readText(name, true);
  const inquiryCity = readText(city, true);
  const inquiryPhone = readText(phone, true);
  const inquiryMessage = readText(message) ?? "";

  if (!inquiryName || !inquiryCity || !inquiryPhone) {
    return Response.json(
      { error: "Name, city, and phone are required." },
      { status: 400 },
    );
  }

  try {
    await createInquiry({
      name: inquiryName,
      city: inquiryCity,
      phone: inquiryPhone,
      message: inquiryMessage,
    });
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Unable to save inquiry", error);
    return Response.json(
      { error: "Unable to save your inquiry right now." },
      { status: 503 },
    );
  }
}
