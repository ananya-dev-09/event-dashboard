import { model, models, Schema, type InferSchemaType } from "mongoose";

const organizationSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    category: { type: String },
    website: { type: String },
    socialLinks: { type: Map, of: String },
    ownerUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teamMemberUserIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followerCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type Organization = InferSchemaType<typeof organizationSchema>;
export const OrganizationModel = models.Organization || model("Organization", organizationSchema);
