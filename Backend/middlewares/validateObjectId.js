import mongoose from 'mongoose'

export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const value = req.params[paramName]

    if (!mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({
        message: `Invalid ${paramName}`
      })
    }

    next()
  }
}
