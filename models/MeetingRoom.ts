import { model, models, Schema } from "mongoose";

const meetingRoomSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event" },
    provider: { type: String, enum: ["JITSI", "ZOOM"], default: "JITSI" },
    roomUrl: { type: String, required: true },
    hostUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const MeetingRoomModel = models.MeetingRoom || model("MeetingRoom", meetingRoomSchema);
