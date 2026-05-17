// Invitation model: Mongoose schema definition for persisted data.
import { Schema, model } from "mongoose";

const invitationSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "workspace",
      required: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Manager", "Member", "Viewer"],
      default: "Member",
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Invitation", invitationSchema);


