import { buildUploadSignature } from "@/lib/services/cloudinary";
import { fail, ok } from "@/lib/utils/route";

export async function POST(request: Request) {
  if (!process.env.CLOUDINARY_API_SECRET) return fail("Cloudinary is not configured", 500);
  let body: Record<string, string> = {};
  try {
    body = (await request.json()) as Record<string, string>;
  } catch {
    return fail("Malformed JSON payload", 400);
  }
  const payload = buildUploadSignature(body ?? {});
  return ok(payload);
}
