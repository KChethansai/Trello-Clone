// template model: Mongoose schema definition for persisted data.
import { Schema, model } from "mongoose";

const templateSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    creatorName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    images: [
      {
        type: String
      }
    ],

    favourites: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    type: {
      type: String,
      default: "template"
    },

    projectRef: {
      type: Schema.Types.ObjectId,
      ref: "project"
    },

    isEditable: {
      type: Boolean,
      default: false
    },

    isPublished: {
      type: Boolean,
      default: false
    },

    publishDetails: {
      companyName: {
        type: String,
        default: ""
      },

      website: {
        type: String,
        default: ""
      },

      contactEmail: {
        type: String,
        default: ""
      },

      templateType: {
        type: String,
        default: ""
      },

      notes: {
        type: String,
        default: ""
      }
    }
  },
  { timestamps: true }
);

export default model("Template", templateSchema);
