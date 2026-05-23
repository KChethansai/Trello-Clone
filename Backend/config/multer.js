//configure RAM image uploads
import multer from 'multer'

export const allowedImageTypes = ['image/jpeg', 'image/png']

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true)
      return
    }

    const err = new Error('Only JPG and PNG images are allowed')
    err.status = 400
    cb(err, false)
  }
})


