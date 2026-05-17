// NotificationModel model: Mongoose schema definition for persisted data.
import { Schema, model } from 'mongoose'

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['card', 'member', 'mention', 'default'],
      default: 'default'
    },
    readLink: {
      type: String,
      default: ''
    },
    //store notification target link
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export const NotificationModel = model('notification', NotificationSchema)


