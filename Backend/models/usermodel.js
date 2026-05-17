// usermodel model: Mongoose schema definition for persisted data.
import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Min length is 2 characters'],
      maxlength: [50, 'Max length is 50 characters'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Min length is 8 characters']
    },
    username: {
      type: String,
      default: '',
      trim: true
    },
    bio: {
      type: String,
      default: '',
      maxlength: [300, 'Bio max 300 characters']
    },
    profilePic: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['MANAGER', 'MEMBER', 'VIEWER', 'ADMIN'],
      default: 'MEMBER'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const UserModel = model('user', UserSchema)


