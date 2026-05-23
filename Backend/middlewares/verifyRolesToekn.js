// verifyRolesToekn middleware: reusable Express request validation and error handling.
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
const { verify } = jwt

export const verifyRolesToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.cookies?.token
      if (!token) {
        return res
          .status(401)
          .json({ message: 'Please login to the application' })
      }

      const decoded = verify(token, env.secretKey)

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        })
      }

      req.user = decoded
      next()
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ message: 'Session expired, please login again' })
      }
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}


