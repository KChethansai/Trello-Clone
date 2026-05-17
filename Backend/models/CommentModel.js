// CommentModel model: Mongoose schema definition for persisted data.
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
      required: true,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const CommentModel = mongoose.model("Comment", commentSchema);


