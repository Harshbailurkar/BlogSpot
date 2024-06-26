import { Schema, model } from "mongoose";

const replyCommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "blog",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const replycomment = model("replycomment", replyCommentSchema);

export default replycomment;
