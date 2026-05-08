import { getAuthSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { EventModel } from "@/models/Event";
import { UserModel } from "@/models/User";
import { fail, ok } from "@/lib/utils/route";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) return fail("Unauthorized", 401);

  await connectToDatabase();
  const user = await UserModel.findById(session.user.id).select("registeredEventIds").lean();
  const events = await EventModel.find({ _id: { $in: user?.registeredEventIds ?? [] } })
    .select("title startAt endAt mode status")
    .sort({ startAt: 1 })
    .lean();

  return ok(events);
}
