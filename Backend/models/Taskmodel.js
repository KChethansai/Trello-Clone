// Taskmodel model: Mongoose schema definition for persisted data.
import { Schema, model } from 'mongoose'

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      minlength: [1, 'title should be minimum of 1 character']
    },
    description: {
      type: String,
      default: ''
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    //allow cards before project binding
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'project',
      default: null,
      index: true
    },
    //allow cards before list binding
    listId: {
      type: Schema.Types.ObjectId,
      ref: 'list',
      default: null,
      index: true
    },
    labels: [
      {
        text: String,
        color: String
      }
    ],
    dueDate: {
      type: Date,
      default: null
    },
    order: {
      type: Number,
      default: 0,
      index: true
    },
    attachment: [
      {
        name: {
          type: String,
          required: [true, 'Attachment name is required']
        },
        url: {
          type: String,
          required: [true, 'Attachment URL is required']
        },
        publicId: {
          type: String,
          default: null
        },
        fileType: {
          type: String,
          enum: ['image/jpeg', 'image/png'],
          required: [true, 'Attachment image type is required']
        },
        size: {
          type: Number,
          required: [true, 'Attachment size is required']
        }
      }
    ],
    status: {
      type: String,
      enum: ['TO-DO', 'IN-PROGRESS', 'DONE'],
      default: 'TO-DO'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

export const taskModel = model('task', TaskSchema)


