// Activity model: Mongoose schema definition for persisted data.
import { Schema, model } from 'mongoose'

const activitySchema = new Schema(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },

    action: {
      type: String,
      required: true,
      enum: [
        'CREATED_TASK',
        'UPDATED_TASK',
        'ASSIGNED_USER',
        'COMMENT_ADDED',
        'MEMBER_ADDED',
        'MEMBER_REMOVED'
      ]
    },

    target: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'targetModel'
    },

    targetModel: {
      type: String,
      required: true,
      enum: ['task', 'project', 'Comment', 'Workspace']
    },

    //optional - null for non-project activities like workspace member changes
    project: {
      type: Schema.Types.ObjectId,
      ref: 'project',
      default: null,
      index: true
    }
  },
  { timestamps: true }
)

export const ActivityModel = model('Activity', activitySchema)


