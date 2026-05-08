import { model, models, Schema, type InferSchemaType } from "mongoose";

const eventSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    bannerUrl: { type: String },
    mode: { type: String, enum: ["ONLINE", "OFFLINE", "HYBRID"], required: true },
    venue: { type: String },
    meetingLink: { type: String },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    registrationDeadline: { type: Date },
    capacity: { type: Number },
    attendeeCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    status: { type: String, enum: ["DRAFT", "PUBLISHED", "COMPLETED", "CANCELLED"], default: "DRAFT" },
    isTrending: { type: Boolean, default: false },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export type Event = InferSchemaType<typeof eventSchema>;
export const EventModel = models.Event || model("Event", eventSchema);
