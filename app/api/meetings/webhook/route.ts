import { ok } from "@/lib/utils/route";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return ok({ received: true, payload });
}
