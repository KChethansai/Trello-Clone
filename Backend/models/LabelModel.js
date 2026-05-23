// LabelModel model: Mongoose schema definition for persisted data.
import { Schema, model } from "mongoose";

const LabelSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name required"],
  },
  color: {
    type: String,
    required: [true, "color required"],
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "project",
    required: [true],
    index: true,
  },
});

export const LabelModel = model("label", LabelSchema);


