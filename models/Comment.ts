import { model, models, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

export const CommentModel = models.Comment || model("Comment", commentSchema);
