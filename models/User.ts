import { model, models, Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["SUPER_ADMIN", "ORG_ADMIN", "INDIVIDUAL"], default: "INDIVIDUAL" },
    avatarUrl: { type: String },
    bio: { type: String },
    organizationIds: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
    followingOrganizationIds: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
    savedPostIds: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    repostedPostIds: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    registeredEventIds: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    authProvider: { type: String, default: "credentials" },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = models.User || model("User", userSchema);
