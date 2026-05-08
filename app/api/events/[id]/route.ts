import { connectToDatabase } from "@/lib/db/mongoose";
import { EventModel } from "@/models/Event";
import { fail, ok } from "@/lib/utils/route";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const event = await EventModel.findById(id).lean();
  if (!event) return fail("Event not found", 404);
  return ok(event);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await request.json();
  await connectToDatabase();
  const event = await EventModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
  if (!event) return fail("Event not found", 404);
  return ok(event);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const event = await EventModel.findByIdAndDelete(id).lean();
  if (!event) return fail("Event not found", 404);
  return ok({ deleted: true });
}
