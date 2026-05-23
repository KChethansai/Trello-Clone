// AttachmentModel model: stores image-only card/comment attachments.
import { Schema, model } from 'mongoose'

const attachmentSchema = new Schema(
  {
    url: {
      type: String,
      required: [true, 'Attachment URL is required'],
      trim: true
    },
    fileName: {
      type: String,
      required: [true, 'Attachment file name is required']
    },
    fileType: {
      type: String,
      enum: ['image/jpeg', 'image/png'],
      required: [true, 'Attachment image type is required']
    },
    size: {
      type: Number,
      required: [true, 'Attachment size is required']
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'task'
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  },
  { timestamps: true, versionKey: false }
)

export default model('Attachment', attachmentSchema)


