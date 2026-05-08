import { model, models, Schema, type InferSchemaType } from "mongoose";

const mediaSchema = new Schema(
  {
    type: { type: String, enum: ["IMAGE", "VIDEO"], required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    thumbnailUrl: { type: String },
    duration: { type: Number },
  },
  { _id: false }
);

const postSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    authorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contentText: { type: String, required: true },
    media: [mediaSchema],
    visibility: { type: String, enum: ["PUBLIC", "FOLLOWERS"], default: "PUBLIC" },
    likeUserIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    saveCount: { type: Number, default: 0 },
    repostCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    hashtags: [{ type: String }],
  },
  { timestamps: true }
);

export type Post = InferSchemaType<typeof postSchema>;
export const PostModel = models.Post || model("Post", postSchema);
