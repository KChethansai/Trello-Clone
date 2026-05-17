// ListModel model: Mongoose schema definition for persisted data.
import { Schema, model } from "mongoose";

const ListSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ListModel = model("list", ListSchema);


