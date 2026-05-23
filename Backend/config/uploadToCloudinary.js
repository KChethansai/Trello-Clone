//upload image buffer to Cloudinary
import cloudinary from './cloudinary.js'

export const uploadToCloudinary = (buffer, folder = 'blog_users') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) return reject(err)
        resolve(result)
      }
    )

    stream.end(buffer)
  })
}


