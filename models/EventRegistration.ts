import { model, models, Schema } from "mongoose";

const eventRegistrationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    ticketId: { type: String, required: true, unique: true },
    qrCodeData: { type: String, required: true },
    status: { type: String, enum: ["REGISTERED", "CANCELLED", "CHECKED_IN"], default: "REGISTERED" },
  },
  { timestamps: true }
);

export const EventRegistrationModel =
  models.EventRegistration || model("EventRegistration", eventRegistrationSchema);
