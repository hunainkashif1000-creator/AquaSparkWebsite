import "server-only";

import { getDatabase } from "@/lib/mongodb";

export type NewInquiry = {
  name: string;
  city: string;
  phone: string;
  message: string;
};

export async function createInquiry(inquiry: NewInquiry) {
  const database = await getDatabase();

  return database.collection<NewInquiry & { createdAt: Date }>("inquiries").insertOne({
    ...inquiry,
    createdAt: new Date(),
  });
}
