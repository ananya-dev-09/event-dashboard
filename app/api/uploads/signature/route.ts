import { buildUploadSignature } from "@/lib/services/cloudinary";
import { fail, ok } from "@/lib/utils/route";

export async function POST(request: Request) {
  if (!process.env.CLOUDINARY_API_SECRET) return fail("Cloudinary is not configured", 500);
  const body = await request.json().catch(() => ({}));
  const payload = buildUploadSignature(body ?? {});
  return ok(payload);
}
