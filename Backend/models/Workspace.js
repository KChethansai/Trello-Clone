// Workspace model: Mongoose schema definition for persisted data.
import { Schema, model } from "mongoose";
const workspaceSchema = new Schema( //creation of workspace schema
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        role: {
          type: String,
          enum: ["MANAGER", "MEMBER", "VIEWER", "ADMIN"],
          default: "MEMBER",
        },
      },
    ],
  },
  { timestamps: true },
);
export const WorkspaceModel = model("workspace", workspaceSchema);


